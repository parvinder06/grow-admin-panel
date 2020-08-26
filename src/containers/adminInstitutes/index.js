import React from 'react';
import { Switch, Route, useRouteMatch, Redirect } from 'react-router-dom';
import AdminInstituteList from '../AdminInstituteList';
import AdminAddInstitute from '../AdminAddCompleteInstitute';
import AdminEditInstitute from '../AdminEditCompleteInstitute';
import AdminInstituteProfile from '../AdminInstituteProfile';
import AdminInstitutesTeachers from '../AdminInstituteTeachers';

const AdminInstitutes = (props) => {

    const { path, url } = useRouteMatch();

    return (
      <Switch>
        <Route exact path={path}>
          <Redirect to={`${path}/adminInstituteList`} />
        </Route>
        <Route path={`${path}/adminInstituteList`}>
          <AdminInstituteList path={path} />
        </Route>
        <Route path={`${path}/adminInstituteProfile`}>
          <AdminInstituteProfile />
        </Route>
        <Route path={`${path}/adminAddInstitute`}>
          <AdminAddInstitute />
        </Route>
        <Route path={`${path}/adminEditInstitute`}>
          <AdminEditInstitute />
        </Route>
        <Route path={`${path}/adminInstituteTeachers`}>
          <AdminInstitutesTeachers />
        </Route>
      </Switch>
    );
}

export default AdminInstitutes;