import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import "./style.css";
import List from "@material-ui/core/List";
import { TextField } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";

const IndexPage = () => {
  const [messages, setmessages] = useState([]);
  //const [updateData, setUpdateData] = useState();

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

  async function handledelete(el) {
    setIsDeleting(true);
    await fetch(`/.netlify/functions/deletedata`, {
      method: "post",
      body: JSON.stringify({ id: el.ref["@ref"].id }),
    });
    setIsDeleting(false);
  }
  return (
    <div>
      <div className="main">
        <h1>CRUD App</h1>
        <Formik
          initialValues={{ message: "" }}
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
            isSubmitting,
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
              {/* <Button
                variant="contained"
                style={{ backgroundColor: "#5cb85c", color: "white" }}
                size="large"
                
                type="submit"
                disabled={isloading ? true : false}
              >
                Save
              </Button> */}
              <Button
                variant="contained"
                color="primary"
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
          return (
            <div className="list">
              <List key={ind}>
                <h2>{el.data.detail}</h2>
                <Button
                  key={ind}
                  onClick={() => {
                    handledelete(el);
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
