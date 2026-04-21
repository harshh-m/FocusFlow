import axios from "axios";

const API =
  "http://localhost:5000/api";

/* ---------------- AUTH ---------------- */

export const loginUser =
  async (data) => {
    const res =
      await axios.post(
        `${API}/auth/login`,
        data
      );

    return res.data;
  };

export const registerUser =
  async (data) => {
    const res =
      await axios.post(
        `${API}/auth/register`,
        data
      );

    return res.data;
  };

/* ---------------- DASHBOARD ---------------- */

export const getDashboardData =
  async () => {
    const token =
      localStorage.getItem(
        "token"
      );

    const res =
      await axios.get(
        `${API}/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

    return res.data;
  };

/* ---------------- ANALYTICS ---------------- */

export const getAnalyticsData =
  async () => {
    const token =
      localStorage.getItem(
        "token"
      );

    const res =
      await axios.get(
        `${API}/analytics`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

    return res.data;
  };

/* ---------------- FOCUS ---------------- */

export const getFocusData =
  async () => {
    const token =
      localStorage.getItem(
        "token"
      );

    const res =
      await axios.get(
        `${API}/focus`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

    return res.data;
  };

export const finishFocusSession = async (data) => {
  const token = localStorage.getItem("token");
  const res = await axios.post(`${API}/focus/finish`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

/* ---------------- REMINDERS ---------------- */

export const getReminders =
  async () => {
    const token =
      localStorage.getItem(
        "token"
      );

    const res =
      await axios.get(
        `${API}/reminders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

    return res.data;
  };

/* ---------------- TIMETABLE ---------------- */

export const getTimetable = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API}/timetable`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const addTimetableTask = async (data) => {
  const token = localStorage.getItem("token");
  const res = await axios.post(`${API}/timetable`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteTimetableTask = async (id) => {
  const token = localStorage.getItem("token");
  const res = await axios.delete(`${API}/timetable/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const toggleTimetableTask = async (id) => {
  const token = localStorage.getItem("token");
  const res = await axios.put(`${API}/timetable/${id}/toggle`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};