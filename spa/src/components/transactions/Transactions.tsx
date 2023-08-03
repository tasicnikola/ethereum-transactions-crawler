import { useState } from "react";
import TextField from "@mui/material/TextField/TextField";
import Box from "@mui/material/Box/Box";
import Button from "@mui/material/Button/Button";
import classes from "./Transactions.module.scss";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import TransactionsService from "../../services/transactions.service";

const Transactions = () => {
  const [inputWallet, setInputWallet] = useState<string>("");
  const [inputBlock, setInputBlock] = useState<string>("");
  const [date, setDate] = useState<Dayjs | null>(null);
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    let parameters: any = {
      wallet: inputWallet,
    };

    if (null !== date) {
      parameters.date = date?.format("YYYY-MM-DD");
    } else {
      parameters.block = inputBlock;
    }

    if (!date) {
      TransactionsService.get(parameters)
        .then((result: any) => {
          console.log(result);
        })
        .catch((error: any) => {
          console.error(error);
        })
        .finally(() => setLoading(true));
    } else {
      TransactionsService.getBalance(parameters)
        .then((result: any) => {
          console.log(result);
        })
        .catch((error: any) => {
          console.error(error);
        })
        .finally(() => setLoading(true));
    }
  };

  return (
    <Box className="boxed">
      <Box className={classes.input}>
        <Box className={classes.box}>
          <TextField
            className={classes.wallet}
            id="outlined-basic"
            label="Wallet"
            variant="outlined"
            value={inputWallet}
            onChange={(e) => setInputWallet(e.target.value)}
          >
            Wallet
          </TextField>
        </Box>
        <Box className={classes.box}>
          <TextField
            id="outlined-basic"
            label="Block"
            variant="outlined"
            value={inputBlock}
            onChange={(e) => setInputBlock(e.target.value)}
            disabled={date !== null}
          >
            Block
          </TextField>
        </Box>
        <Box>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DatePicker"]}>
              <DatePicker
                value={null}
                label="Select Date"
                onChange={(date) => setDate(date)}
                maxDate={dayjs()}
              />
            </DemoContainer>
          </LocalizationProvider>
        </Box>
        <Button className={classes.button} onClick={handleClick}>
          Search
        </Button>
      </Box>
    </Box>
  );
};

export default Transactions;
