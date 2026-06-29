class ApiResponse {
    constructor(statusCode, message, data) {
        this.statusCode = statusCode;
        this.success = true;
        this.message = message || "Success";
        this.data = data;
    }
}

export { ApiResponse };