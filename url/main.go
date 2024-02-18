package main

import (
	"crypto/sha256"
	"database/sql"
	"encoding/hex"
	"encoding/json"
	"github.com/gorilla/mux"
	_ "github.com/mattn/go-sqlite3" // Import go-sqlite3 library
	"io"
	"log"
	"net/http"
	"os"
)

var (
	db *sql.DB
)

func main() {
	//INFO: database init
	filePath := "db.db"
	handleCreateDatabase(filePath)
	d, _ := sql.Open("sqlite3", "./sqlite-database.db")
	db = d
	createTable(db)

	//INFO: mux router init
	r := mux.NewRouter()
	// Routes consist of a path and a handler function.
	r.HandleFunc("/", YourHandler)
	r.HandleFunc("/health", HealthCheckHandler)
	r.HandleFunc("/shorten", handler).Methods("POST")
	r.HandleFunc("/{hash}", RouteUrl)

	// Bind to a port and pass our router in
	log.Fatal(http.ListenAndServe(":8000", r))
}

func HealthCheckHandler(w http.ResponseWriter, r *http.Request) {
	// A very simple health check.
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	io.WriteString(w, `{"alive": true}`)
}

func YourHandler(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Gorilla!\n"))
}

func ShortenURL(url string) string {
	hash := sha256.Sum256([]byte(url))
	return hex.EncodeToString(hash[:])[:8]
}

func handleCreateDatabase(filePath string) {
	// Check if the file exists
	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		// File does not exist, create it
		file, err := os.Create(filePath)
		if err != nil {
			log.Fatal(err)
		}
		defer file.Close()
	} else if err != nil {
		// An error occurred while checking file existence
		log.Fatal(err)
	}
}

func createTable(db *sql.DB) {
	createURLTableSQL := `CREATE TABLE IF NOT EXISTS urls (
		"id" INTEGER PRIMARY KEY AUTOINCREMENT,
		"original_url" TEXT NOT NULL,
		"shortened_url" TEXT NOT NULL
	);`

	log.Println("Creating urls table...")
	_, err := db.Exec(createURLTableSQL)
	if err != nil {
		log.Fatal(err.Error())
	}
	log.Println("urls table created")
}

type URLPair struct {
	OriginalURL  string
	ShortenedURL string
}

// InsertURLPair inserts a pair of original and shortened URLs into the database
func InsertURLPair(db *sql.DB, pair URLPair) error {
	insertSQL := `INSERT INTO urls (original_url, shortened_url) VALUES (?, ?)`
	_, err := db.Exec(insertSQL, pair.OriginalURL, pair.ShortenedURL)
	if err != nil {
		log.Println("Error inserting URL pair:", err)
		return err
	}
	log.Println("URL pair inserted successfully")
	return nil
}

func FindOriginalURL(db *sql.DB, newURL string) (string, error) {
	var originalURL string
	query := `SELECT original_url FROM urls WHERE shortened_url = ?`
	err := db.QueryRow(query, newURL).Scan(&originalURL)
	if err != nil {
		if err == sql.ErrNoRows {
			log.Printf("No record found for shortened URL: %s", newURL)
		} else {
			log.Println("Error querying database:", err)
		}
		return "", err
	}
	return originalURL, nil
}

type Body struct {
	URL string `json:"url"`
}

type URLResponse struct {
	Key      string `json:"key"`
	LongURL  string `json:"long_url"`
	ShortURL string `json:"short_url"`
}

func handler(w http.ResponseWriter, r *http.Request) {
	// Read the request body
	decoder := json.NewDecoder(r.Body)
	var body Body
	err := decoder.Decode(&body)
	if err != nil {
		http.Error(w, "Error reading request body", http.StatusBadRequest)
		return
	}
	newURL := ShortenURL(body.URL)

	// Example usage
	pair := URLPair{
		OriginalURL:  body.URL,
		ShortenedURL: newURL,
	}
	err = InsertURLPair(db, pair)
	if err != nil {
		log.Println("Error inserting URL pair:", err)
		http.Error(w, "Error inserting URL pair", http.StatusInternalServerError)
		return
	}

	// Prepare response
	response := URLResponse{
		Key:      newURL, // Assuming the shortened URL is the key
		LongURL:  body.URL,
		ShortURL: "http://localhost/" + newURL,
	}

	// Write JSON response
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func RouteUrl(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	hash := vars["hash"]
	log.Println(hash)
	url, err := FindOriginalURL(db, hash)

	if err != nil {
		log.Println("Error finding URL:", err)
	}
	w.Write([]byte(url))
}
