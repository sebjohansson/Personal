use axum::Router;

use tower_http::services::{ServeDir, ServeFile};

#[tokio::main]
async fn main() {
    let serve_dir = ServeDir::new("static").not_found_service(ServeFile::new("static/index.html"));
    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    let app = Router::new()
        .route_service("/lab", ServeFile::new("static/lab.html"))
        .fallback_service(serve_dir);
    axum::serve(listener, app).await.unwrap();
}
