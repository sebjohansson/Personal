FROM rust:alpine

WORKDIR /usr/src/app

COPY . .

RUN cargo install --path .

CMD ["server"]
