#----config
# แก้วันที่ 9/04/66 หลังทำการอัป 1.0.5
version :=1.0.5#version images same docker-compose
user_docker :=tawanyummy#userId docker


name :=evoting-server:$(version)


up:
	docker-compose up -d --force-recreate
	docker tag $(name) $(user_docker)/$(name)
#docker-compose -f docker-compose.dev.yaml  up -d --force-recreate -> ไว้สร้าง image และ run docker
#docker tag $(name) $(user_docker)/$(name)  -> สร้าง tag , $(name) คือ image ที่จะสร้าง clone ไปสร้าง tag และ $(user_docker)/$(name) คือชื่อ tag

down:
	docker-compose down
	docker rmi $(name)
	docker rmi $(user_docker)/$(name)

test:
	docker run -d  --publish 3001:3001 $(user_docker)/$(name)

#upload docker images to docker hub
push:
	docker push $(user_docker)/$(name)

#รัน make up
