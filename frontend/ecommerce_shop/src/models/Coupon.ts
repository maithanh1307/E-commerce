export type Coupon = {
    code: string;
    label: string;
    type: 'percent' | 'fixed';
    value: number;
    minSubtotal?: number;
};
