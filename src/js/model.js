import { API_URL, RES_PER_PAGE } from "./config";
import { getJSON } from "./helpers";

export const state = {
    recipe: {},
    search: {
        query: '',
        result: [],
        page: 1,
        resultsPerPage: RES_PER_PAGE,
    },
    bookmarks: [],
};

export const loadRecipe = async function(id){
    try{
        const data = await getJSON(`${API_URL}/${id}`);
        
        const {recipe} = data.data;
        state.recipe = {
            id : recipe.id,
            title : recipe.title,
            publisher : recipe.publisher,
            sourceUrl: recipe.source_url,
            image: recipe.image_url,
            servings: recipe.servings,
            cookingTime: recipe.cooking_time,
            ingredients: recipe.ingredients,
        }
        if(state.bookmarks.some(bookmark => bookmark.id === id))
                state.recipe.bookmarked = true;
        else
                 state.recipe.bookmarked = false;
    } catch(err){
        console.error(`${err} 💥`);
        throw err;
    }
};

export const loadSearchResults = async function(query){
    try{
        state.search.query = query;
        const data = await getJSON(`${API_URL}?search=${query}`);
        // console.log(data);
        state.search.result = data.data.recipes.map(rec => {
            return{
                id: rec.id,
                title: rec.title,
                publisher: rec.publisher,
                image: rec.image_url,
            };
        }); 
        state.search.page = 1;
    } catch(err) {
        console.error(`${err} 💥`);
        // throw err;
    }
};


export const searchResultsPerPage = function(page = state.search.page){
    state.search.page = page;

    const start = (page-1)*state.search.resultsPerPage;
    const end = page*state.search.resultsPerPage;

    return state.search.result.slice(start, end);
};

export const updateServings = function(newServings){
    state.recipe.ingredients.forEach(ing => {
        ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    });
    state.recipe.servings = newServings;
}

const loadBookmarks = function(){
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));

}

export const addBookmark = function(recipe){
    // add bookmark
    state.bookmarks.push(recipe);

    //mark current recipe as bookmarked
    if(recipe.id === state.recipe.id){
        state.recipe.bookmarked = true;
    }
    loadBookmarks();
}

export const removeBookmark = function(id){
    // delete bookmark
    const index = state.bookmarks.findIndex(el => el.id === id);
    state.bookmarks.splice(index, 1);

    //mark current recipe as NOT bookmarked
    if(id === state.recipe.id){
        state.recipe.bookmarked = false;
    }
    loadBookmarks();
}

const init = function(){
    const stored = localStorage.getItem('bookmarks');
    if(stored) state.bookmarks = JSON.parse(stored);
}
init();