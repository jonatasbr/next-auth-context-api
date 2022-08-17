import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { withSSRAuth } from '../utils/withSSRAuth';
import { getApi } from '../services/api';
import { api } from '../services/apiClient';
import { useCan } from '../hooks/useCan';

export default function Dashboard() {
  const { user  } = useContext(AuthContext);

  const userIsAdmin = useCan({
    roles: ['administrator']
  });

  useEffect(() => {
    api.get('/profile')
    .then((response) => console.log(response))
    .catch((err) => console.log(err));
  }, []);
  return (
    <div>
      <h1>Dashboard: {user?.email}</h1>

      { userIsAdmin && <div>Usuário admin</div> }
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