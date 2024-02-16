package main

import (
	"bufio"
	"flag"
	"fmt"
	"os"
	"strings"
)

var (
	c           bool
	l           bool
	w           bool
	m           bool
	content     string
	fileContent string
)

func main() {

	var FinalReturn []string

	//NOTE: Parse command-line flags
	flag.BoolVar(&c, "c", false, "Return number of bytes in a file")      // return count of files
	flag.BoolVar(&l, "l", false, "Return number of lines in a file")      // return count of files
	flag.BoolVar(&w, "w", false, "Return number of words in a file")      // return count of files
	flag.BoolVar(&m, "m", false, "Return number of characters in a file") // return count of files
	flag.Parse()

	//INFO: Get non-flag command-line arguments
	args := flag.Args()

	if len(args) == 0 {
		reader := bufio.NewReader(os.Stdin)
		for {
			str, err := reader.ReadString('\n')
			if err != nil {
				break // End of file reached or error encountered, break the loop
			}
			content += str // Append the input to content
		}
	}

	//INFO: default options
	if !c && !l && !w && !m {
		c = true
		l = true
		m = true
	}

	//INFO: Read the file
	if len(args) > 0 {
		fileContent, err := os.ReadFile(args[0])
		if err != nil {
			fmt.Println("Error reading file:", err)
			return
		}
		content += string(fileContent)
	}

	if c == true {
		FinalReturn = append(FinalReturn, GetBytesFromString(content))
	}

	if l == true {
		FinalReturn = append(FinalReturn, GetNumberOfLinesFromString(content))
	}

	if w == true {
		FinalReturn = append(FinalReturn, GetNumberOfWordsFromString(content))
	}

	if m == true {
		FinalReturn = append(FinalReturn, GetNumberOfCharactersFromString(content))
	}

	DisplayResults(FinalReturn)

}

func DisplayResults(results []string) {
	for i := 0; i < len(results); i++ {
		fmt.Println(results[i])
	}
}

func GetNumberOfCharactersFromString(fileContent string) string {
	lines := strings.Split(fileContent, "")
	lineCount := len(lines)
	return fmt.Sprintf("Number of characters is %v", lineCount)
}

func GetNumberOfWordsFromString(fileContent string) string {
	lines := strings.Fields(fileContent)
	lineCount := len(lines)
	return fmt.Sprintf("Number of words is %v", lineCount)
}

func GetNumberOfLinesFromString(fileContent string) string {
	lines := strings.Split(fileContent, "\n")
	lineCount := len(lines) - 1
	return fmt.Sprintf("Number of lines is %v", lineCount)
}

func GetBytesFromString(fileContent string) string {
	b := []byte(fileContent)
	return fmt.Sprintf("Number of bytes is %v", len(b))
}
