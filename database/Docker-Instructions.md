docker run --name upx-postgres -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 -d postgres

docker exec -it upx-postgres psql -U postgres -c "CREATE DATABASE water_system;"
docker cp "C:\Users\gabri\OneDrive\Projetos\UPX-II\database\water_system_schema.sql" upx-postgres:/tmp/
docker exec -it upx-postgres psql -U postgres -d water_system -f /tmp/water_system_schema.sql
# verify
docker exec -it upx-postgres psql -U postgres -d water_system -c "\dt"

docker cp "C:\Users\gabri\OneDrive\Projetos\UPX-II\database\water_system_example_data.sql" upx-postgres:/tmp/
docker exec -it upx-postgres psql -U postgres -d water_system -f /tmp/water_system_example_data.sql

# Tip: stop on first SQL error during import so you can see failing statement
# You can use `-v ON_ERROR_STOP=1` to make psql stop on error; example:
docker exec -it upx-postgres psql -U postgres -d water_system -v ON_ERROR_STOP=1 -f /tmp/water_system_example_data.sql
