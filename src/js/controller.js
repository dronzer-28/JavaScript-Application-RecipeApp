import * as model from './model';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import paginationView from './views/paginationView';
import bookmarksView from './views/bookmarksView';
import addRecipeView from './views/addRecipeView';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// https://forkify-api.herokuapp.com/v2



if(module.hot){
  module.hot.accept();
}

const controlRecipe = async function(){
  try{
    const id = window.location.hash.slice(1);

    if(!id) return;
    recipeView.renderSpinner();

    //0) update search results to highlight selected recipe
    resultsView.update(model.searchResultsPerPage());
    bookmarksView.update(model.state.bookmarks);

    //1) loading recipe
    await model.loadRecipe(id);
    
    //2) rendering recipe
    recipeView.render(model.state.recipe);

  } catch(err){
    recipeView.renderError();
    console.error(err);
  }
}

const controlSearchResults = async function() {
  try{
    resultsView.renderSpinner();
    //1) get query
    const query = searchView.getQuery();
    if(!query) return;

    //2) load results
    await model.loadSearchResults(query);

    //3) render results
    resultsView.render(model.searchResultsPerPage());

    //4) render pagination
    paginationView.render(model.state.search);

  } catch(err){
    console.log(err);
  }
}

const controlPagination = function(goToPage){
  // 1 render new results
  resultsView.render(model.searchResultsPerPage(goToPage));
  // 2 render new pagination btn
  paginationView.render(model.state.search);
}

const controlServings = function(newServings){
  //update servings
  if(newServings<1) return;
  model.updateServings(newServings);

  //update revipe view
  recipeView.update(model.state.recipe);
}

const controlAddBookmark = function(){
  //add/remove bookmarks
  if(!model.state.recipe.bookmarked)
    model.addBookmark(model.state.recipe);
  else
    model.removeBookmark(model.state.recipe.id);

  //update view
  recipeView.update(model.state.recipe)

  //update bookmarks panel
  bookmarksView.render(model.state.bookmarks);
}

const controlBookmarks = function(){
  bookmarksView.render(model.state.bookmarks);
}

const controlAddRecipe = function(newRecipe){
  console.log(newRecipe);
}

const init = function(){
  bookmarksView.addHandlerBookmarks(controlBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults); 
  paginationView.addHandlerPageChange(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
}

init();

// ['hashchange','load'].forEach(ev => window.addEventListener(ev, controlRecipe));