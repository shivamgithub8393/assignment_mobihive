import {useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFinancialData } from '../features/financialSlice';
import { logout } from '../features/authSlice';
import { useNavigate, Link } from 'react-router-dom';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { accountBalance, transactions, notifications, loading } = useSelector(
    (state) => state.financial
  );
  const {name} = useSelector(state => state.profile)
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchFinancialData());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={handleLogout}>Logout</button>
      <Link to="/profile">
        <button>Edit Profile</button>
      </Link>
      <h2>User: {name}</h2>
      <h3>Account Balance: INR{accountBalance}</h3>
      <h3>Recent Transactions</h3>
      <ul>
        {transactions.map((txn) => (
          <li key={txn.id}>
            {txn.date}: INR{txn.amount} ({txn.type})
          </li>
        ))}
      </ul>
      <h3>Notifications</h3>
      <ul>
        {notifications.map((note, index) => (
          <li key={index}>{note}</li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;