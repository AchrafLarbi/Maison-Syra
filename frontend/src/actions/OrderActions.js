import axios from "axios";
import {
  ORDER_ALL_FAIL,
  ORDER_ALL_REQUEST,
  ORDER_ALL_SUCCESS,
  ORDER_CREATE_FAIL,
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_DELIVER_FAIL,
  ORDER_DELIVER_REQUEST,
  ORDER_DELIVER_SUCCESS,
  ORDER_DETAILS_FAIL,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS,
  ORDER_MYORDERS_FAIL,
  ORDER_MYORDERS_REQUEST,
  ORDER_MYORDERS_SUCCESS,
  ORDER_PAY_FAIL,
  ORDER_PAY_REQUEST,
  ORDER_PAY_SUCCESS,
} from "../constants/OrderConstants";
import { CART_CLEAR_ITEMS } from "../constants/CartConstants";

export const createOrderAction = (order) => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_CREATE_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();
    const url = process.env.REACT_APP_API_URL + "/api/orders/add/";
    const headers = {
      "Content-Type": "application/json",
    };
    if (userInfo && userInfo.token) {
      headers["Authorization"] = `Bearer ${userInfo.token}`;
    }
    const config = { headers };
    const { data } = await axios.post(url, order, config);
    dispatch({ type: ORDER_CREATE_SUCCESS, payload: data });
    dispatch({ type: CART_CLEAR_ITEMS });
    // remove the cart items from the local storage
    localStorage.removeItem("cartItems");
  } catch (error) {
    dispatch({
      type: ORDER_CREATE_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

// get order details
export const getOrderDetailsAction = (id) => async (dispatch, getState) => {
  try {
    console.log(`[REGULAR] Fetching order details for ID: ${id}`);
    dispatch({ type: ORDER_DETAILS_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();
    const url =
      (process.env.REACT_APP_API_URL || "http://localhost:8000") +
      `/api/orders/${id}/`;
    console.log(`[REGULAR] Request URL: ${url}`);
    console.log(
      `[REGULAR] User token: ${userInfo?.token ? "Present" : "Missing"}`
    );
    const headers = {};
    if (userInfo && userInfo.token) {
      headers["Authorization"] = `Bearer ${userInfo.token}`;
    }
    const config = { headers };
    const { data } = await axios.get(url, config);
    console.log(`[REGULAR] Order data received:`, data);
    dispatch({ type: ORDER_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    console.error(`[REGULAR] Error fetching order ${id}:`, error);
    console.error(`[REGULAR] Error response:`, error.response?.data);
    dispatch({
      type: ORDER_DETAILS_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

// pay order action
export const payOrderAction =
  (orderId, paymentResult) => async (dispatch, getState) => {
    try {
      dispatch({ type: ORDER_PAY_REQUEST });
      const {
        userLogin: { userInfo },
      } = getState();
      const url = process.env.REACT_APP_API_URL + `/api/orders/${orderId}/pay/`;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.put(url, paymentResult, config);
      dispatch({ type: ORDER_PAY_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: ORDER_PAY_FAIL,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
      });
    }
  };
export const MyOrdersAction = () => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_MYORDERS_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();
    const url = process.env.REACT_APP_API_URL + `/api/orders/myorders/`;
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    const { data } = await axios.get(url, config);
    dispatch({ type: ORDER_MYORDERS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: ORDER_MYORDERS_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

// get all orders
export const allOrdersAction = () => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_ALL_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();
    const url = process.env.REACT_APP_API_URL + `/api/orders/all/`;
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    const { data } = await axios.get(url, config);
    dispatch({ type: ORDER_ALL_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: ORDER_ALL_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};
// update order to delivered
export const deliverOrderAction =
  (id, formData = null) =>
  async (dispatch, getState) => {
    try {
      dispatch({ type: ORDER_DELIVER_REQUEST });
      const {
        userLogin: { userInfo },
      } = getState();
      const url = process.env.REACT_APP_API_URL + `/api/orders/${id}/deliver/`;

      let config;
      let requestData;

      if (formData) {
        // If formData is provided (image upload)
        config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
            "Content-Type": "multipart/form-data",
          },
        };
        requestData = formData;
      } else {
        // Regular delivery without image
        config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
            "Content-Type": "application/json",
          },
        };
        requestData = {};
      }

      const { data } = await axios.put(url, requestData, config);
      dispatch({ type: ORDER_DELIVER_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: ORDER_DELIVER_FAIL,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
      });
    }
  };
