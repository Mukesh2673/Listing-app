import axios from "axios";
export const getCommonHeaders = () => {
  const headers = {
    Accept: "application/json",
    "Access-Control-Allow-Origin": "*",
    authorization:
      localStorage.getItem("authorization") != null
        ? localStorage.getItem("authorization")
        : "",
  };
  return headers;
};

export const mediaCommonHeaders = () => {
  const headers = {
    /*     Accept: 'application/json',
    'Access-Control-Allow-Origin': '*', */
    //'content-type': 'multipart/form-data',
    authorization:
      localStorage.getItem("authorization") != null
        ? localStorage.getItem("authorization")
        : "",
  };
  return headers;
};

export const getMediaHeader = () => {
  const headers = {
    "Content-Type": "multipart/form-data",
    authorization:
      localStorage.getItem("authorization") != null
        ? localStorage.getItem("authorization")
        : "",
  };
  return headers;
};

export const httpGet = async (url) => {
  return axios
    .get(url, {
      headers: getCommonHeaders(),
    })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      if (err.response.status === 403) {
        localStorage.removeItem("authorization");
        window.location.reload();
      }
      return err.res;
    });
};

export const httpDelete = async (url) => {
  return axios
    .delete(url, {
      headers: getCommonHeaders(),
    })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      if (err.response.status === 403) {
        localStorage.removeItem("authorization");
        window.location.reload();
      }
      return err.res;
    });
};

export const httpPost = async (url, body) => {
  return axios
    .post(url, body, {
      headers: getCommonHeaders(),
    })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      if (err.response.status === 403) {
        localStorage.removeItem("authorization");
        window.location.reload();
      }
      return err.response;
    });
};

export const httpPut = async (url, body) => {
  return axios
    .put(url, body, {
      headers: getCommonHeaders(),
    })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      if (err.response.status === 403) {
        localStorage.removeItem("authorization");
        window.location.reload();
      }
      return err.res;
    });
};

export const httpPostFormData = async (url, body) => {
  let commonHeaders = mediaCommonHeaders();
  delete commonHeaders.Accept;

  return axios
    .post(url, body, {
      headers: commonHeaders,
    })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      if(err.response.status === 403){
        localStorage.removeItem("authorization");
        window.location.reload();
      }
      return err.response;
    });
};

export const httpPutFormData = async (url, body) => {
  let commonHeaders = getCommonHeaders();
  delete commonHeaders.Accept;

  return axios
    .put(url, body, {
      headers: commonHeaders,
    })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      if(err.response.status === 403){
        localStorage.removeItem("authorization");
        window.location.reload();
      }
      return err.response;
    });
};
