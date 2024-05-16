# Define variables
POSTGRES_PASSWORD=mysecretpassword

# Targets
run: run-postgres stage dev studio

run-postgres:
	docker-compose -f ./compose.yml up -d

stage:
	pnpm stage

dev:
	pnpm run dev

studio:
	npx prisma studio

# Clean up
clean:
	docker stop my-postgres && docker rm my-postgres

.PHONY: run run-postgres stage dev studio clean