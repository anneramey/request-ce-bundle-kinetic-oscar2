import React, { Fragment } from 'react';
import { Link } from '@reach/router';

import wallyHappyImage from 'common/src/assets/images/wally-happy.svg';
import { RequestCard } from '../shared/RequestCard';
import { PageTitle } from '../shared/PageTitle';

import { getSubmissionPath } from '../../utils';
import { I18n } from '@kineticdata/react';

const emptyStateMessage = type => {
  switch (type) {
    case 'Draft': {
      return "You have no draft requests. Draft services are forms you started but haven't submitted yet.";
    }
    case 'Open': {
      return 'You have no open requests. If you request something, it will show up here.';
    }
    case 'Closed': {
      return "Closed requests are services  you've requested that have been completed or canceled.";
    }
    default: {
      return 'No requests found. Submit a service and it will show up here!';
    }
  }
};

export const RequestList = ({
  forms,
  submissions,
  type,
  hasNextPage,
  hasPreviousPage,
  handleNextPage,
  handlePreviousPage,
  refreshPage,
  appLocation,
}) => (
  <Fragment>
    <PageTitle parts={['My Requests']} />
    <span className="services-color-bar services-color-bar__blue-slate" />
    <div className="page-container page-container--request-list">
      <div className="page-title">
        <div className="page-title__wrapper">
          <h3>
            <Link to={appLocation}>
              <I18n>services</I18n>
            </Link>{' '}
            /{' '}
            {type && (
              <Link to={`${appLocation}/requests`}>
                <I18n>requests</I18n>
              </Link>
            )}
            {type && ' / '}
          </h3>
          <h1>
            <I18n>{type || 'All Requests'}</I18n>
          </h1>
        </div>
        <div className="btn-group">
          <button
            type="button"
            className="btn btn-inverse"
            disabled={!hasPreviousPage}
            onClick={handlePreviousPage}
          >
            <span className="icon">
              <span className="fa fa-fw fa-caret-left" />
            </span>
          </button>
          <button
            type="button"
            className="btn btn-inverse"
            disabled={!hasNextPage}
            onClick={handleNextPage}
          >
            <span className="icon">
              <span className="fa fa-fw fa-caret-right" />
            </span>
          </button>
        </div>
      </div>
      <div className="cards__wrapper cards__wrapper--requests">
        {submissions.size > 0 ? (
          submissions
            .map(submission => ({
              submission,
              forms,
              key: submission.id,
              path: getSubmissionPath(appLocation, submission, null, type),
              deleteCallback: refreshPage,
            }))
            .map(props => <RequestCard {...props} />)
        ) : (
          <div className="empty-state empty-state--wally">
            <h5>
              <I18n>No {type !== 'All' ? type : ''} Requests Found...</I18n>
            </h5>
            <img src={wallyHappyImage} alt="Happy Wally" />
            <h6>
              <I18n>{emptyStateMessage(type)}</I18n>
            </h6>
          </div>
        )}
      </div>
    </div>
  </Fragment>
);
