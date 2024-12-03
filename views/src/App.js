import React, { useEffect, useState } from "react";


function App() {
  
  // get url params
  const urlParams = new URLSearchParams(window.location.search);
  const messageParam = urlParams.get("message");
  const statusParam = urlParams.get("status");
  const typeParam = urlParams.get("type");
  const userId = urlParams.get("id");

  // states for verification page
  const [message, setMessage] = useState(null);
  const [icon, setIcon] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  //frontend url 
  // const url = `http://localhost:8800/login`;
  const url = `https://social-media-app-ksvc.onrender.com/login`;

  const handleSubmit = async (e) => { // password reset
    // prevent default event
    e.preventDefault();

    // set error message to null
    setErrorMessage(null);


    // get password and confirm password
    const password = e.target[0].value;
    const confirmPassword = e.target[1].value;

    // check if passwords match
    if (password !== confirmPassword) {
      window.alert("Passwords do not match. Please try again.");
      return;
    }

    // server url 
    const apiUrl = `https://social-media-app-ksvc.onrender.com/users/reset-password`;
    // const apiUrl = `${process.env.REACT_APP_URL}/users/reset-password`;
    console.log(apiUrl);

    try {

      // send post request
      const response = await fetch(apiUrl, {
        method: "POST",
        // redirect: 'manual',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, password }),
      });

      console.log(response);

      // check if response is ok
      if (response.ok) {
        window.alert("Password reset successful!");
        window.location.replace(url);
        setErrorMessage({
          status: "ok",
          msg: "Password reset successful!",
        });
      } else { // if response is not ok

        setErrorMessage({ // set error message
          status: "failed",
          msg: "Password reset failed. Please try again.",
        });
      }
    } catch (error) {
      console.log("Network error");
      setErrorMessage({ // set error message
        status: "failed",
        msg: "An error occurred. Please try again later.",
      });
      console.log("An error occurred:", error);
    }
  };

  const EmailVerification = () => { // email verification
    return (
      <div className='card'>
        <div className='icon'>
          <span id='statusIcon'>{icon}</span>
        </div>
        <div
          id='statusMessage'
          className={statusParam === "success" ? `success` : "error"}
        >
          {message}
        </div>
        {statusParam === "success" && (
          <a href={url} id='btnLogin' className='showBtn'>
            Login
          </a>
        )}
      </div>
    );
  };

  const PasswordReset = () => {  // password reset
    return (
      <div class='card'>
        <div class='title'>Password Reset</div>
        <form id='resetForm' onSubmit={handleSubmit}>
          <input
            type='password'
            className='input-field'
            id='password'
            placeholder='New Password'
            required
          />
          <input
            type='password'
            class='input-field'
            id='confirmPassword'
            placeholder='Confirm Password'
            required
          />
          {errorMessage?.status !== "ok" && (
            <button type='submit' id='btnSubmit' class='submit-button'>
              Submit
            </button>
          )}
        </form>
        {errorMessage?.status === "ok" && (
          <a href={url} id='btnLogin' className='showBtn'>
            Login
          </a>
        )}
        <div
          className={errorMessage?.status === "ok" ? `success` : "error"}
          id='statusMessage'
        >
          {errorMessage?.msg}
        </div>
      </div>
    );
  };

  useEffect(() => { // set icon and message

    if (!typeParam) {

      // for success
      if (statusParam === "success") {
        setIcon("✔️");
        setMessage(messageParam);
      } else if (statusParam === "error") { // for error
        setIcon("❌");
        setMessage(messageParam);
      } else { // for unknown
        setIcon("❓");
        setMessage("Something went wrong. Try again");
      }
    } else {
    }
  }, [typeParam, messageParam, statusParam]);

  return ( // render email verification or password reset
    <div className='App'>
      {typeParam ? <PasswordReset /> : <EmailVerification />}
    </div>
  );
}

export default App;
