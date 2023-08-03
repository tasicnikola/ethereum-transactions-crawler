import ETCService from "./etc.service";
import { Transactions as TransactionsParams } from "../interfaces/Params/Transations/Transations";
import { Balance as BalanceParams } from "../interfaces/Params/Balance/Balance";

class TransactionsService {
  public static get(parameters: TransactionsParams): Promise<string> {
    return ETCService.sendRequest<any>("POST", "transactions", parameters)
      .then((data: any) => data)
      .catch((err) => {
        console.log(err);
        throw err;
      });
  }

  public static getBalance(parameters: BalanceParams): Promise<string> {
    return ETCService.sendRequest<any>("POST", "eth-balance", parameters)
      .then((data: any) => data)
      .catch((err) => {
        console.log(err);
        throw err;
      });
  }
}

export default TransactionsService;
