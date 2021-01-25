import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import "./style.css";
import List from "@material-ui/core/List";
import Swal from "sweetalert2";
import { TextField } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import Switch from "@material-ui/core/Switch";

const IndexPage = () => {

  function myFunction(el) {
    var element = document.body;
    element.classList.toggle("dark-mode");
 }
  const [messages, setmessages] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isloading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetch(`/.netlify/functions/getdata`)
      .then((response) => response.json())
      .then((data) => {
        setmessages(data);
        console.log(JSON.stringify(data));
      });
  }, [isloading, isDeleting, isUpdating]);

  if (isDeleting === true) {
    return (
      <div className="loading">
        <CircularProgress id="loader" />
      </div>
    );
  }
  ////////////////////////////////////////////////////
  async function handledelete(el) {
    setIsDeleting(true);
    await fetch(`/.netlify/functions/deletedata`, {
      method: "post",
      body: JSON.stringify({ id: el.ref["@ref"].id }),
    });
    setIsDeleting(false);
  }
  async function handleupdate(el) {
    setIsUpdating(true);
    const { value: update } = await Swal.fire({
      input: "text",
      inputLabel: "Message",
      inputValue: el.data.message,
      showCancelButton: true,
    });
    if (update === null) {
      console.log("no data");
    } else {
      await fetch(`/.netlify/functions/updatedata`, {
        method: "post",
        body: JSON.stringify({ id: el.ref["@ref"].id, message: update }),
      });
    }
    setIsUpdating(false);
  }
  /////////////////////////////////////////////////////
  return (
    <div className="body">
      <div style={{marginLeft: '90%',textAlign: 'center'}}>
        <p>Dark Mode</p>
        <Switch
        
          onChange={myFunction}
          name="checkedB"
          color="white"
        />
      </div>
      <div className="main">
        <h1>CRUD App</h1>

        <Formik
          initialValues={{
            message: "",
          }}
          onSubmit={(values, actions) => {
            setIsLoading(true);
            fetch(`/.netlify/functions/hello`, {
              method: "post",
              body: JSON.stringify(values),
            })
              .then((response) => response.json())
              .then((data) => {
                console.log(data);
              });
            setIsLoading(false);
            actions.resetForm({
              values: {
                message: "",
              },
            });
          }}
        >
          {({
            values,
            handleChange,
            handleBlur,
            handleSubmit,

            /* and other goodies */
          }) => (
            <form onSubmit={handleSubmit}>
              <TextField
                type="text"
                name="message"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.message}
                label="Message"
                multiline
                className="input"
                style={{width: '40%', color: 'white'}}
                required
                rows={6}
                variant="outlined"
              />
              <br />
              <br />
              <Button
                variant="contained"
                style={{ backgroundColor: "#4BB543", color: "#ffff" }}
                size="large"
                type="submit"
                disabled={isloading ? true : false}
                startIcon={<SaveIcon />}
              >
                Save
              </Button>
            </form>
          )}
        </Formik>
      </div>

      <Box mt={3}>
        {!messages ? (
          <div className="loading">
            <CircularProgress id="loader" />
          </div>
        ) : (
          messages.map((el) => {
            console.log(el.ref["@ref"].id);
            return (
              <div className="list">
                <List>
                  <h2>{el.data.message}</h2>
                  <Button
                    onClick={() => {
                      handleupdate(el);
                    }}
                    variant="contained"
                    color="primary"
                  >
                    Update
                  </Button>
                  {"  "}
                  <Button
                    onClick={() => {
                      handledelete(el);
                    }}
                    variant="contained"
                    color="secondary"
                  >
                    Delete
                  </Button>
                </List>
              </div>
            );
          })
        )}
      </Box>
    </div>
  );
};

export default IndexPage;
