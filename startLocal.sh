#ngrok
result=$(ps aux | grep ngrok | grep 3000)
if [ $? -eq 0 ];
then
    echo "ngrok is already running, doing nothing"
else
    echo "ngrok is not running, starting it"
    ngrok http 3000 --config ngrok.yml > /dev/null &
    sleep 2 # Wait for ngrok to start
    public_url=$(curl -s localhost:4050/api/tunnels | jq -r '.tunnels[0].public_url')
    new_env=$(cat .env | sed "s#^NGROK_URL=.*#NGROK_URL=$public_url#")
    echo "$new_env" > .env
fi

#docker
result=$(docker ps | grep postgres)
if [ $? -eq 0 ];
then
    echo "postgres is already running, doing nothing"
else
    echo "postgres is not running, starting it"
    docker rm postgres --force
    mkdir -p postgres-data
    docker run --name postgres -d -p 5432:5432 -e POSTGRES_PASSWORD=1234 -v ./postgres-data:/var/lib/postgresql/data postgres
    sleep 5 # Wait for postgres to start
fi

