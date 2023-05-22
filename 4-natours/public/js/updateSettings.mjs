/* eslint-disable import/prefer-default-export */
// Update data function
import axios from 'axios';
import { showAlert } from './alerts.mjs';

// Type is either password or data
export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? '/api/v1/users/updatePassword'
        : '/api/v1/users/updateMe';
    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Data updated successfully');
    }
  } catch (err) {
    showAlert('error', err.message);
  }
};
