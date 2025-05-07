export class TheOrderHasAlreadyBeenWithdrawError extends Error {
    constructor(orderId: string){
        super(`The order with id: "${orderId}" has already been withdraw`)
    }
}