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

const Transactions = () => {
  const [inputWallet, setInputWallet] = useState<string>("");
  const [inputBlock, setInputBlock] = useState<string>("");
  const [date, setDate] = useState<Dayjs | null>(
    null
  );

  const handleClick = () => {};

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
        >
          Block
        </TextField>
        </Box>
        <Box>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DatePicker"]}>
            <DatePicker 
            value = {null}
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
