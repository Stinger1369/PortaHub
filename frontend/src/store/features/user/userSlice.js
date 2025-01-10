import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// L'état initial de l'utilisateur
const initialState = {
  user: null,
  accessToken: null,
  status: 'idle', // idle, loading, success, error
  error: null,
};

// **AsyncThunk pour l'inscription**
export const signupUser = createAsyncThunk(
  'user/signup',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:3000/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de l’inscription.');
      }

      const data = await response.json();
      return data; // Retourne `{ user, accessToken }` depuis le backend
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// **AsyncThunk pour la connexion**
export const loginUser = createAsyncThunk(
  'user/login',
  async (loginData, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:3000/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la connexion.');
      }

      const data = await response.json();
      return data; // Retourne `{ accessToken, userId, email }`
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// **AsyncThunk pour la validation du compte**
export const validateAccount = createAsyncThunk(
  'user/validate',
  async (validationData, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:3000/users/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validationData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la validation.');
      }

      const data = await response.json();
      return data; // Retourne `{ message }`
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// **AsyncThunk pour la déconnexion**
export const logoutUser = createAsyncThunk(
  'user/logout',
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    const accessToken = state.user.accessToken;

    try {
      const response = await fetch('http://localhost:3000/users/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la déconnexion.');
      }

      return { message: 'Déconnexion réussie' };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// **Slice utilisateur**
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setError: (state, action) => {
      state.error = action.payload;
      state.status = 'error';
    },
    clearError: (state) => {
      state.error = null;
    },
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // **Gestion des états pour l'inscription**
      .addCase(signupUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.status = 'success';
        state.error = null;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload;
      })

      // **Gestion des états pour la connexion**
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.accessToken = action.payload.accessToken;
        state.status = 'success';
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload;
      })

      // **Gestion des états pour la validation du compte**
      .addCase(validateAccount.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(validateAccount.fulfilled, (state, action) => {
        state.status = 'success';
        state.error = null;
      })
      .addCase(validateAccount.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload;
      })

      // **Gestion des états pour la déconnexion**
      .addCase(logoutUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.status = 'idle';
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload;
      });
  },
});

// **Export des actions et du sélecteur**
export const { setError, clearError, resetState } = userSlice.actions;
export const selectUser = (state) => state.user;

export default userSlice.reducer;
