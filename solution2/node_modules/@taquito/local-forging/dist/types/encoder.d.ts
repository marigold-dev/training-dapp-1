export declare type Encoder<T> = (val: T) => string;
export declare const encoders: {
    [key: string]: Encoder<any>;
};
