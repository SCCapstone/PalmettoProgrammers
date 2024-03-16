import AuthService from './authService';
import RequestBuilder from '../helpers/requestBuilder';

import config from '../config';
const API_BASE_URL = config.API_URL;

const ACTIONS = {
  FRIEND: 'friend',
  BLOCK: 'block',
};

const STATUS = {
  PENDING: 'Pending',
  REQUESTED: 'Requested',
  FRIENDS: 'Friends',
  BLOCKED: 'Blocked',
  NONE: 'None',
};

/**
 * PostRelation
 * Use this function to create a relation between two users
 * Can be used to create a friend request, accept a friend request, or block a user
 *
 * @param {number} userId Id of the user to create the relation with
 * @param {string} userAction The action to take on the user {friend|block}
 */
const postRelation = async (userId, userAction) => {
  const response = await fetch(
    `${API_BASE_URL}/relations/${userId}/${userAction}`,
    {
      method: 'POST',
      headers: {
        ...AuthService.getAuthHeader(),
      },
    },
  );

  if (!response.ok) {
    throw new Error('Error in relation creation');
  }
};

/**
 * RemoveRelation
 * Use this function to remove a relation between two users
 * Can be used to remove a friend, unblock a user, reject a friend request, or cancel a friend request
 *
 * @param {number} userId Id of the user to remove the relation with
 */
const removeRelation = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/relations/${userId}`, {
    method: 'DELETE',
    headers: {
      ...AuthService.getAuthHeader(),
    },
  });

  if (!response.ok) {
    throw new Error('Error in relation deletion');
  }
};

/**
 * GetStatus
 * Use this function to get the status of a relation between the logged in user and user given by id
 *
 * @param {number} userId Id of the user to get the relation status with
 * @returns {string} Status: The status of the relation {Pending|Requested|Friends|Blocked|None}
 */
const getStatus = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/relations/${userId}/status`, {
    method: 'GET',
    headers: {
      ...AuthService.getAuthHeader(),
    },
  });

  if (!response.ok) {
    throw new Error('Error in getting relation status');
  }

  const jsonResponse = await response.json();
  return jsonResponse.status;
};

/**
 * GetRelations
 * Use this function to get the relations of a user with other users
 *
 * @param {number} userId Id of the user to get the relations with
 * @param {object} query the query parameters object {limit: number, page: number, relation: string}
 * @returns {List<object>} UserProfiles: UserProfiles of the users with the given relation status
 */
const getRelations = async (userId, query) => {
  let authHeader = null;
  try {
    authHeader = AuthService.getAuthHeader();
  } catch {
    // Nothing
  }

  var queryString = RequestBuilder.buildUserQueryString(query);

  const response = await fetch(
    `${API_BASE_URL}/relations/${userId}/${query.relation}?${queryString}`,
    {
      method: 'GET',
      headers: {
        ...(authHeader ? { ...authHeader } : {}),
      },
    },
  );

  if (!response.ok) {
    throw new Error('Error in getting relation status');
  }

  const totalCount = parseInt(response.headers.get('x-total-count'));
  const responseData = await response.json();
  return { data: responseData, totalCount: totalCount };
};

const RelationService = {
  ACTIONS,
  STATUS,
  postRelation,
  removeRelation,
  getStatus,
  getRelations,
};
export default RelationService;
