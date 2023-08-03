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
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Typography } from "@mui/material";

const Transactions = () => {
  const [inputWallet, setInputWallet] = useState<string>("");
  const [inputBlock, setInputBlock] = useState<string>("");
  const [date, setDate] = useState<Dayjs | null>(null);
  const [transactions, setTransactions] = useState<any>([]);
  const [balance, setBalance] = useState<any>([]);
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  const handleClick = () => {
    setOpenBackdrop(true);

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
        .then((result) => {
          setTransactions(result);
          setOpenBackdrop(false);
        })
        .catch((err) => console.log(err));
    } else {
      TransactionsService.getBalance(parameters)
        .then((result) => {
          setBalance(result);
          setOpenBackdrop(false);
          setOpenAlert(true);
        })
        .catch((err) => console.log(err));
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
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Transaction</TableCell>
              <TableCell align="left">From</TableCell>
              <TableCell align="left">To</TableCell>
              <TableCell align="left">Value</TableCell>
              <TableCell align="left">Nonce</TableCell>
              <TableCell align="left">Block</TableCell>
              <TableCell align="left">Gas</TableCell>
              <TableCell align="left">Gas Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions?.map((tx: any) => (
              <TableRow
                key={tx.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {tx.hash}
                </TableCell>
                <TableCell align="right">{tx.from}</TableCell>
                <TableCell align="right">{tx.to}</TableCell>
                <TableCell align="right">{tx.value}</TableCell>
                <TableCell align="right">{tx.nonce}</TableCell>
                <TableCell align="right">{tx.blockHash}</TableCell>
                <TableCell align="right">{tx.gas}</TableCell>
                <TableCell align="right">{tx.gasPrice}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openBackdrop}
        onClick={() => {}}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Dialog
        open={openAlert}
        onClose={handleCloseAlert}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Wallet balance on selected date was:"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Typography>{balance.balance}</Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAlert} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Transactions;
