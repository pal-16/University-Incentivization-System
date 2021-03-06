import React, { useEffect, useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
  Button,
  Paper,
} from "@material-ui/core";

import Spinner from "../../components/Spinner";
import { useAuthState, useAuthDispatch } from "../../context/AuthContext";
import { useHistory } from "react-router-dom";
import { login } from "../../actions/authActions";
import { SnackbarContext } from "../../context/SnackbarContext";


const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "80vh"
  },
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "50%"
    },
    [theme.breakpoints.up("md")]: {
      width: "40%"
    }
  },
  form: {
    width: "100%",
    justifyContent: "center"
  },
  formInner: {
    padding: "20px 30px"
  },
  formControl: {
    marginTop: "15px",
    marginBottom: "20px"
  }
}));

const Login = (props) => {
  const classes = useStyles();
  const { isAuthenticated, userType } = useAuthState();
  const dispatch = useAuthDispatch();
  const history = useHistory();
  const { setOpen, setSeverity, setMessage } = useContext(SnackbarContext);



  const [loading, setLoading] = useState(false);




  const handleGenerate = async (event) => {


    if (localStorage.getItem("pubkey") === null) {

      window.vjcoin.register();
      event.preventDefault();
      let secondsRemaining = 60;
      let id = setInterval(frame, 1000);
      setLoading(true);
      function frame() {
        if (secondsRemaining == 0) {
          setSeverity("error");
          setMessage("Application approved. Reward will be mined shortly.");
          handleClose();
          return;
        }
        secondsRemaining--;
        if (localStorage.getItem("pubkey") !== null) {
          clearInterval(id);

          setLoading(false);
          history.push(`/${props.userType}/register`);
        }
      }
    } else {

      setSeverity("error");
      setMessage("You currently have a logged in account. Try importing account to connect to wallet");
      setOpen(true);
      event.preventDefault();

    }
  };
  const handleLogin = async (event) => {
    if (localStorage.getItem("pubkey") === null) {

      window.vjcoin.login();
      event.preventDefault();

      let id = setInterval(frame, 1000);
      setLoading(true);
      function frame() {
        if (localStorage.getItem("pubkey") !== null) {

          const pubkey = localStorage.getItem("pubkey");
          login({
            dispatch,
            pubkey,
            rememberme: true,
            userType: props.userType
          }).then((res) => {
            if (res.error) {
              setSeverity("error");
              setMessage(res.error);
              event.preventDefault();
              setLoading(false);
              setOpen(true);
            } else {
              setSeverity("success");
              setMessage("You have successfully logged in.");
              setOpen(true);
              setLoading(false);
              history.push(`/${props.userType}/applications`);
            }
          });


          clearInterval(id);
        }
      }
    }
    else {
      event.preventDefault();
      const pubkey = localStorage.getItem("pubkey");
      login({
        dispatch,
        pubkey,
        rememberme: true,
        userType: props.userType
      }).then((res) => {
        if (res.error) {
          setSeverity("error");
          setMessage(res.error);

          setOpen(true);
          event.preventDefault();
        } else {
          setSeverity("success");
          setMessage("You have successfully logged in.");
          setOpen(true);
          history.push(`/${props.userType}/applications`);
        }
      });


    }
  };

  useEffect(() => {



  }, []);

  return loading ? (
    <Spinner />
  ) : (
    <Box
      className={classes.root}
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Paper elevation={3} className={classes.paper}>

        <form className={classes.form} noValidate>

          <div>

            <Button
              onClick={handleGenerate}
              size="large"
              color="primary"
              type="submit"
              fullWidth
              variant="contained"
            >
              Are you a new user? Generate Key Pair
            </Button>
          </div>
          <br>
          </br>


          <div>
            <Button
              onClick={handleLogin}
              size="large"
              color="primary"
              type="submit"
              fullWidth
              variant="contained"
            >
              Import existing
            </Button>
          </div>
        </form>
        {/* <Typography
          style={{ color: "#303F9E", fontSize: 15, marginBottom: "15px" }}
        >
          Don't have an account?
          <Link style={{ color: "#303F9E" }} to={`/${props.userType}/register`}>
            {" "}
            Sign Up
          </Link>
        </Typography> */}
      </Paper>
    </Box >
  );
};

export default Login;
