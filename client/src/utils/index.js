import axios from "axios";
import { SetPosts } from "../redux/postSlice";

// api url
const API_URL = "";

// axios instance
export const API = axios.create({
  baseURL: API_URL,
  responseType: "json",
});

// api request
export const apiRequest = async ({ url, method, data, token }) => { 

  try {

    const result = await API(url, { // make api request
      method: method || "GET",
      data: data ,
      headers: {
        "content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "", // attach token
      }
    });

    return result?.data;

  } catch (error) { 

    // destructure error
    const err = error.response.data;

    console.log(err);

    // return error
    return {
      status: err.success,
      message: err.message,
    }
  }
};

export const handleFileUpload = async (uploadFile) => { 

  // create form data
  const formData = new FormData();
  formData.append("file", uploadFile);
  formData.append("upload_preset", "socialmedia");

  try {
    
    // upload image
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_ID}/image/upload`,
      formData
    );

    return response.data.secure_url;

  } catch (error) {
    
    console.log(error);

  }

};

export const fetchPosts = async ( token, dispatch, uri, data ) => { 
  
  try {
    // get posts
    const res = await apiRequest({
      url: uri || "/posts",
      method: "POST",
      token,
      data: data || {},
    });

    // set posts
    dispatch(SetPosts(res?.data));
    return;
  } catch (error) {
    console.log(error);
  }
};

export const likePost = async ({ uri, token }) => { 

  try {
    
    const res = await apiRequest({
      url: uri,
      method: "POST",
      token,
    });

    return res;

  } catch (error) {
    console.log(error)
  }

};

export const deletePost = async (id, token ) => { 

  try {
    const res = await apiRequest({
      url: `/posts/${id}`,  
      method: "DELETE",
      token,
    });
    return res;
  } catch (error) {
    console.log(error); 
  }
};

export const getUserInfo = async ( token, id ) => { 

  try {
    // if id is not passed
    const uri = id === undefined ? "/users/get-user" : `/users/get-user/${id}`;

    // get user
    const res = await apiRequest({
      url: uri,
      method: "POST",
      token,
    });

    // if authentication failed
    if (res.message === "Authentication failed") {
      localStorage.removeItem("user"); // remove token
      window.alert("User Session Expired. Please Login Again."); // show alert
      window.location.replace("/login"); // redirect
    }

    // return user
    return res?.user;
  } catch (error) {
    console.log(error);
  }
};

export const sendFriendRequest = async (token, id) => { 

  try {
    const res = await apiRequest({
      url: "/users/friend-request",
      method: "POST",
      token,
      data: { requestTo: id },
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const viewUsersProfile = async (token, id) => { 

  try {
    const res = await apiRequest({
      url: "/users/profile-view",
      method: "POST",
      token,
      data: { id },
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

