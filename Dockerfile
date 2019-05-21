FROM node:alpine
RUN apk update && \
    apk add tzdata && \
    cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && \
    echo "10.10.4.2 mail.5spower.com www.5spower.com about.5spower.com agent.5spower.com" >> /etc/hosts && \
    echo "10.10.0.2 testm.5spower.com testa.5spower.com testab.5spower.com" >> /etc/hosts && \	
	mkdir /app/
ADD ./dist/ /app/
WORKDIR /app/
EXPOSE 3000
ENTRYPOINT ["node", "--max_old_space_size=4096" ,"index.js"]	
