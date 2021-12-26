sudo docker stop collect-data-container
sudo docker rm collect-data-container;
sudo docker rmi collect-data;
sudo docker build -t collect-data .;
sudo docker run --restart always --network="host" --name collect-data-container -d collect-data;
