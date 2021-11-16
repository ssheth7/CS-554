import { gql } from '@apollo/client';

const GET_IMAGES = gql`
  query($pageNum: Int) {
    unsplashImages(pageNum: $pageNum) {
      id
      url
      description
      posterName
      userPosted
      binned
    }
  }
`;

const GET_BINNED = gql`
  query {
    binnedImages {
      id
      url
      description
      posterName
      userPosted
      binned
    }
  }
`;

const GET_USERPOSTED = gql`
  query {
    userPostedImages {
      id
      url
      description
      posterName
      userPosted
      binned
    }
  }
`;
const ADD_IMAGE = gql`
  mutation createImage(
    $url: String!
    $description: String
    $posterName: String
  ) {
    uploadImage(
      url: $url
      description: $description
      posterName: $posterName
    ) {
      id
      url
      description
      posterName
      userPosted
      binned
    }
  }
`;

const EDIT_IMAGE = gql`
  mutation changeImage(
    $id: ID!
    $url: String!
    $description: String
    $posterName: String
    $userPosted: Boolean
    $binned: Boolean
    ) {
    updateImage(
      id: $id
      url: $url
      description: $description
      posterName: $posterName
      userPosted: $userPosted
      binned: $binned
      ) {
        id
        url
        description
        posterName
        userPosted
        binned
    }
  }
`;

const DELETE_IMAGE = gql`
  mutation removeImage($id: ID!) {
    deleteImage(id: $id) {
      id
      url
      description
      posterName
      userPosted
      binned
    }
  }
`;

let exported = {
  GET_IMAGES,
  GET_BINNED,
  GET_USERPOSTED,
  ADD_IMAGE,
  EDIT_IMAGE,
  DELETE_IMAGE
};

export default exported;

