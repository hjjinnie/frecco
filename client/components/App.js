import React, { Component } from "react";
import { Link, Route, Switch, withRouter } from 'react-router-dom';
import Header1 from "./Header1";
import Header2 from "./Header2";
import Header3 from "./Header3";
import LeftContainer from "./LeftContainer";
import RightContainer from "./RightContainer";
import FilterForm from "./FilterForm";

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: null,
      password: null,
      firstname: null,
      lastname: null,
      loginMessage: null,
      signupMessage: null,
      posts: [],
      filteredPosts: [],
      postFilter: {
        'location': null, 
        'category': null, 
        'minrating': 1
      },
      categories: ['Attraction', 'Food', 'Accomodation'],
      locations: ['Paris', 'Texas', 'Taylors Condo'],
      postData: {
        location: null,
        category: null,
        rating: null,
        recommendation: null,
        review_text: null
      }
    };
    // methods to handle signup/login
    this.signup = this.signup.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleChangeFirstname = this.handleChangeFirstname.bind(this);
    this.handleChangeLastname = this.handleChangeLastname.bind(this);
    this.handleChangeUsername = this.handleChangeUsername.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleChangeLocation = this.handleChangeLocation.bind(this);
    this.handleChangeCategory = this.handleChangeCategory.bind(this);
    this.handleChangeRating = this.handleChangeRating.bind(this);
    // methods for fetching posts
    this.fetch = this.fetchPosts.bind(this);
    this.filterPosts = this.filterPosts.bind(this);
    // methods for posting
    this.handlePostForm = this.handlePostForm.bind(this);
    this.handleChangeRecommendation = this.handleChangeRecommendation.bind(this);
    this.handleChangeReview = this.handleChangeReview.bind(this);
    this.handleChangePostRating = this.handleChangePostRating.bind(this);
    this.handleChangePostLocation = this.handleChangePostLocation.bind(this);
    this.handleChangePostCategory = this.handleChangePostCategory.bind(this);
  }
  handleChangeFirstname() {
    this.setState({ firstname: event.target.value });
  }
  handleChangeLastname() {
    this.setState({ lastname: event.target.value });
  }
  handleChangeUsername() {
    this.setState({ username: event.target.value });
  }
  handleChangePassword() {
    this.setState({ password: event.target.value });
  }
  handleChangeLocation(e) {
    this.setState({ postFilter: {...this.state.postFilter, 'location': e.target.value}})
  }
  handleChangeCategory(e) {
    this.setState({ postFilter: {...this.state.postFilter, 'category': e.target.value}})
  }
  handleChangeRating(e) {
    this.setState({ postFilter: {...this.state.postFilter, 'minrating': e.target.value}})
  }

  //Post form Handles
  handleChangeRecommendation(e) {
    this.setState({ postData: {...this.state.postData, recommendation: e.target.value}})
  }
  handleChangeReview(e) {
    this.setState({ postData: {...this.state.postData, review_text: e.target.value}})
  }
  handleChangePostLocation(e) {
    this.setState({ postData: {...this.state.postData, location: e.target.value}})
  }
  handleChangePostCategory(e) {
    this.setState({ postData: {...this.state.postData, category: e.target.value}})
  }
  handleChangePostRating(e) {
    this.setState({ postData: {...this.state.postData, rating: e.target.value}})
  }

  handlePostForm() {
    //post form data to server
    const data = {
      username: this.state.username,
      location: this.state.postData.location,
      category: this.state.postData.category,
      rating: this.state.postData.rating,
      recommendation: this.state.postData.recommendation,
      review_text: this.state.postData.review_text
    }
    fetch('/users/submitreview', {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((data) => {
        console.log('Success:', data);
      })
      .catch((err) => {
        console.error('Error:', err);
      });
  }
  signup() {
    //post data. if successfull go to header3
    const data = { 
      firstname: this.state.firstname,
      lastname: this.state.lastname,
      username: this.state.username,
      password: this.state.password,
    };
    fetch('/users/signup', { 
      method:'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then((res) => {
        if (!res.ok) { 
          console.log('signup error') 
          this.setState({signupMessage:'Invalid signup information.'})
        } 
        else {
          // redirect to new page
          this.props.history.push('/header2')
        }
      });
  }
  login() {
    const data = { 
      username: this.state.username,
      password: this.state.password
    };
    fetch('/users/login', { 
      method:'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data) 
    })
      .then((res) => {
        if (!res.ok) { 
          console.log('login error') 
          this.setState({loginMessage: 'Invalid login information'})
        } 
        else {
          // redirect to new page
          this.props.history.push('/header2')
        }
      });
  }
  logout(){
    this.setState({
      username: null,
      password: null,
      firstname: null,
      lastname: null,
    })
    this.props.history.push('/')
  }
  componentDidMount(){
    // fetch posts only once, then fetch again every 20 seconds
    this.fetchPosts();
    //this.timer = setInterval(() => this.fetchPosts(),5000)
  }
  componentWillUnmount(){
    clearInterval(this.timer)
  }
  fetchPosts(){
    fetch('users/filterreview', {
      method: 'POST',
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
       }
    })
      .then((res) => res.json())
      .then((json)=> {
        this.setState({
          posts: json, 
          filteredPosts: json
        });
      })
  }
  filterPosts(){
    // filter posts to show, based on user selection
    let newfilteredPosts = this.state.posts;
    newfilteredPosts = newfilteredPosts.filter((post) => {
      let result = true;
      if (this.state.postFilter.location && (this.state.postFilter.location !== post.location)) {
        result = false;
      }
      if (this.state.postFilter.category && (this.state.postFilter.category !== post.category)) {
        result = false;
      }
      if (this.state.postFilter.minrating && (this.state.minrating > post.rating)) {
        result = false;
      }
      return result;
    });
    this.setState( { filteredPosts: newfilteredPosts });
  }
  render() {
    return (
      <div>
          <Switch>
              <Route exact path='/' render={() => 
                <Header1 message={this.state.loginMessage} login={this.login} handleChangeUsername={this.handleChangeUsername} handleChangePassword={this.handleChangePassword} />}/>
              <Route exact path='/header2' render={()=> 
                <Header2 username={this.state.username} logout={this.logout}/>}/>
              <Route exact path='/header3' render={()=> 
                <Header3 message={this.state.signupMessage} signup={this.signup} handleChangeUsername={this.handleChangeUsername} handleChangePassword={this.handleChangePassword} handleChangeFirstname={this.handleChangeFirstname} handleChangeLastname={this.handleChangeLastname}/>}/>
          </Switch>
          <div id='wrapper'>
            <LeftContainer 
            handleChangePostCategory={this.handleChangePostCategory}
            handleChangePostLocation={this.handleChangePostLocation}
            handleChangePostRating={this.handleChangePostRating}
            handleChangeRecommendation={this.handleChangeRecommendation}
            handleChangeReview={this.handleChangeReview}
            handlePostForm={this.handlePostForm}
            categories={this.state.categories}
            locations={this.state.locations} />
            <RightContainer 
             filterPosts={this.filterPosts}
             handleChangeCategory={this.handleChangeCategory}
             handleChangeLocation={this.handleChangeLocation}
             handleChangeRating={this.handleChangeRating}
             location={this.state.postFilter.location}
             category={this.state.postFilter.category}
             minrating={this.state.postFilter.minrating}
             />
          </div>
      </div>
    );
  }
}

export default withRouter(App);