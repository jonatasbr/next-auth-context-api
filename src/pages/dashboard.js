import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { withSSRAuth } from '../utils/withSSRAuth';
import { getApi } from '../services/api';
import { api } from '../services/apiClient';
import { useCan } from '../hooks/useCan';
import { Can } from '../components/Can';

export default function Dashboard() {
  const { user  } = useContext(AuthContext);

  useEffect(() => {
    api.get('/profile')
    .then((response) => console.log(response))
    .catch((err) => console.log(err));
  }, []);
  return (
    <div>
      <h1>Dashboard: {user?.email}</h1>

      <Can roles={['administrator']}>
        <div>recurso de admin</div>
      </Can>
    </div>
  );
}

export const getServerSideProps = withSSRAuth(async (context) => {
  const apiServer = getApi(context);
  const response = await apiServer.get('/profile');
  
  console.log(response.data);

  return {
    props: {}
  }
});