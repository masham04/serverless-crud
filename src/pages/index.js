import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import "./style.css";
import swal from 'sweetalert';
import List from "@material-ui/core/List";
import { TextField } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";



const IndexPage = () => {
  
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
   
    // setIsUpdating(true)
    // // const update = prompt("Enter values");
    // const {value: name} = await swal({
    //   title: 'Input your name',
    //   input: 'text',
    //   inputPlaceholder: 'Enter here',
    //   value: el.data.message
    // })
  
    // if (value === null) {
    //   console.log("no data");
    // } else {
    //   await fetch(`/.netlify/functions/updatedata`, {
    //     method: "post",
    //     body: JSON.stringify({ id: el.ref["@ref"].id, message: value }),
    //   });
    // }
    // setIsUpdating(false);
    
  }
  /////////////////////////////////////////////////////
  return (
    <div>
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
                id="input"
                required
                style={{ width: "40%" }}
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
        {messages.map((el, ind) => {
          console.log(el.ref["@ref"].id);
          return (
            <div className="list" key={ind}>
              <List>
                <h2>{el.data.message}</h2>
                <Button
                  onClick={() => {
                    handleupdate(el)
                    
                  }}
                  variant="contained"
                  color="primary"
                  disabled={isUpdating ? true : false}
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
                  disabled={isDeleting ? true : false}
                >
                  Delete
                </Button>
              </List>
            </div>
          );
        })}
      </Box>
  
      
    </div>
  );
};

export default IndexPage;
