import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import ItemContainer from "./ItemContainer";
import Review from "./Review";
import { handleFetchItemDetail } from "../reducer/itemDetail";
import { handleAddItem, handleGetReviewed } from "../reducer/users";
import { Link } from "react-router-dom";

class ItemDetail extends Component {
  componentDidMount() {
    const { itemId, handleFetchItemDetail, handleGetReviewed } = this.props;
    handleFetchItemDetail(itemId);
    handleGetReviewed();
  }

  addCart = () => {
    const { itemId, handleAddItem, history, uid } = this.props;
    handleAddItem(itemId, () => {
      history.push(`/cart/${uid}`);
    });
  };

  editCart = () => {
    const { history, uid } = this.props;
    history.push(`/cart/${uid}`);
  };

  render() {
    const {
      isFetching,
      item,
      error,
      cartError,
      inCart,
      inStock,
      hasReviewed
    } = this.props;

    let cartButton;
    if (inCart) {
      cartButton = (
        <button style={styles.cart} onClick={this.editCart}>
          Edit Cart
        </button>
      );
    } else {
      if (inStock) {
        cartButton = (
          <div>
            <button style={styles.cart} onClick={this.addCart}>
              Add to Cart
            </button>
            <p style={{ textAlign: "center", color: "red", marginTop: 10 }}>
              {cartError}
            </p>
          </div>
        );
      } else {
        cartButton = (
          <button style={styles.cart} disabled>
            Out of Stock
          </button>
        );
      }
    }

    return (
      <div>
        {isFetching ? (
          <p style={{ textAlign: "center" }}>LOADING</p>
        ) : (
          <div>
            {item.map(item => (
              <div key={`div${item._id}`}>
                <ItemContainer itemId={item._id} />
                {cartButton}
                <h3 style={styles.detailTitle}>DETAILS</h3>
                <p style={styles.details}>{item.detail}</p>
                <h3 style={styles.reviewTitle}>REVIEWS</h3>
                {item.reviews.map(review => (
                  <Review key={review._id} {...review} />
                ))}
                {hasReviewed ? (
                  <Link
                    to={`/editreview/${item._id}`}
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    <button style={styles.review}>Edit Review</button>
                  </Link>
                ) : (
                  <Link
                    to={`/addreview/${item._id}`}
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    <button style={styles.review}>Write a Review</button>
                  </Link>
                )}
              </div>
            ))}
            <p style={{ textAlign: "center", color: "red", marginTop: 10 }}>
              {error}
            </p>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = ({ users, items, itemDetail }, ownProps) => {
  const itemId = ownProps.match.params.itemId;
  return {
    uid: users.ownInfo._id,
    itemId,
    isFetching: itemDetail.isFetching,
    error: itemDetail.error,
    item: items[itemId] ? [items[itemId]] : [],
    cartError: users.cartError,
    inCart: users.cart[itemId] ? true : false,
    inStock: items[itemId] ? items[itemId].stock > 0 : false,
    hasReviewed: users.reviewedItems.includes(itemId)
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      handleFetchItemDetail,
      handleAddItem,
      handleGetReviewed
    },
    dispatch
  );
};

const styles = {
  cart: {
    display: "block",
    width: "100%",
    border: "none",
    backgroundColor: "#E9AA59",
    padding: "14px 28px",
    fontSize: "16px",
    cursor: "pointer",
    textAlign: "center",
    borderRadius: "10px"
  },
  detailTitle: {
    marginBottom: "5px",
    fontSize: "22px"
  },
  details: {
    margin: "5px",
    fontSize: "15px"
  },
  reviewTitle: {
    fontSize: "22px"
  },
  review: {
    display: "block",
    width: "100%",
    border: "none",
    backgroundColor: "#DADADA",
    padding: "14px 28px",
    fontSize: "16px",
    cursor: "pointer",
    textAlign: "center",
    borderRadius: "10px"
  }
};

ItemDetail = connect(mapStateToProps, mapDispatchToProps)(ItemDetail);

export default ItemDetail;
