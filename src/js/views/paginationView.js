import View from "./view";

import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
    _parentElement = document.querySelector('.pagination');

    addHandlerPageChange(handler) {
        this._parentElement.addEventListener('click', function(e){
            const btn = e.target.closest('.btn--inline');
            if(!btn) return;
            
            console.log(btn);
            const goToPage = +btn.dataset.goto;
            handler(goToPage);
        });
    }

    _generateMarkup() {
        const numPages = Math.ceil(this._data.result.length / this._data.resultsPerPage);
        console.log(numPages);

        //page 1 and others
        if (this._data.page === 1 && numPages > 1)
            return `
            <button data-goto="${this._data.page + 1}" class="btn--inline pagination__btn--next">
                <span>Page ${this._data.page + 1}</span>
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button>
        `;

        //last page
        if (this._data.page === numPages)
            return `
                <button data-goto="${this._data.page - 1}" class="btn--inline pagination__btn--prev">
                    <svg class="search__icon">
                    <use href="${icons}#icon-arrow-left"></use>
                    </svg>
                    <span>Page ${this._data.page - 1}</span>
                </button>
            `;

        //some other
        if (this._data.page < numPages)
            return `
                <button data-goto="${this._data.page - 1}" class="btn--inline pagination__btn--prev">
                    <svg class="search__icon">
                    <use href="${icons}#icon-arrow-left"></use>
                    </svg>
                    <span>Page ${this._data.page - 1}</span>
                </button>
                <button data-goto="${this._data.page + 1}" class="btn--inline pagination__btn--next">
                    <span>Page ${this._data.page + 1}</span>
                    <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                    </svg>
                </button>
        `;

        //only 1 page
        return ``
    }
}

export default new PaginationView();