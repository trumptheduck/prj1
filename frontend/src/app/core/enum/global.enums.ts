export enum OrderStatus {
    processing,
    queued,
    preparing,
    serving,
    completed,
    cancelled,
    failed
}

export enum PaymentStatus {
    unpaid,
    paid,
}

export enum PaymentType {
    cash = "cash",
    creditCard= "creditCard",
}
