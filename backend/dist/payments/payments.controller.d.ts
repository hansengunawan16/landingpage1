import { PaymentsService } from './payments.service';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    initiate(orderId: string): Promise<{
        success: boolean;
        data: {
            payment_url: any;
            token: any;
        };
    }>;
    webhook(payload: any): Promise<{
        success: boolean;
        message: string;
    } | {
        success: boolean;
        message?: undefined;
    }>;
}
