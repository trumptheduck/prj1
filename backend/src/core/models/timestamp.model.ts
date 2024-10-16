export abstract class MongooseModel {
    _id: string;
    owner?: string;
}

export abstract class TimestampModel extends MongooseModel {
    createdAt: Date
    updatedAt: Date
}