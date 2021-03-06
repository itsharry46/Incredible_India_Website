const cards = document.querySelectorAll('.card');

const toggleExpansion = (element, to, duration = 350) => 
{
  return new Promise((res) => 
  {
    requestAnimationFrame(() => 
    {
      element.style.transition = `width ${duration}ms ease-in-out,height ${duration}ms ease-in-out,
            left ${duration}ms ease-in-out,
            top ${duration}ms ease-in-out
          `;
          element.style.top = to.top;
          element.style.left = to.left;
          element.style.width = to.width;
          element.style.height = to.height;
        });
        setTimeout(res, duration);
      })
    }

    const fadeContent = (element, opacity, duration = 300) => {
      return new Promise(res => {
        [...element.children].forEach((child) => {
          requestAnimationFrame(() => {
            child.style.transition = `opacity ${duration}ms linear`;
            child.style.opacity = opacity;
          });
        })
        setTimeout(res, duration);
      })
    }

    const getCardContent = (title, type) => {
      return `
        <div class="card-content">
        <h2>${title}</h2>
          <p>
            ${type}
          </p>
         </div>
      `;
    }

    
    const onCardClick = async (e) => {
      const card = e.currentTarget;
      // clone the card
      const cardClone = card.cloneNode(true);
      // get the location of the card in the view
      const {top, left, width, height} = card.getBoundingClientRect();
      // position the clone on top of the original
      cardClone.style.position = 'fixed';
      cardClone.style.top = top + 'px';
      cardClone.style.left = left + 'px';
      cardClone.style.width = width + 'px';
      cardClone.style.height = height + 'px';
      // hide the original card with opacity
      card.style.opacity = '0';
      // add card to the same container
      card.parentNode.appendChild(cardClone);
      // create a close button to handle the undo
      const closeButton = document.createElement('button');
      // position the close button top corner
      closeButton.style = `
        position: fixed;
        z-index: 10000;
        top: 35px;
        right: 35px;
        width: 35px;
        height: 35px;
        border-radius: 50%;
        background-color: rgba(181, 42, 42,0.8);
      `;
      // attach click event to the close button
      closeButton.addEventListener('click', async () => {
        // remove the button on close
        closeButton.remove();
        // remove the display style so the original content is displayed right
        cardClone.style.removeProperty('display');
        cardClone.style.removeProperty('padding');
        // show original card content
        [...cardClone.children].forEach(child => child.style.removeProperty('display'));
        fadeContent(cardClone, '0');
        // shrink the card back to the original position and size
        await toggleExpansion(cardClone, {top: `${top}px`, left: `${left}px`, width: `${width}px`, height: `${height}px`}, 300)
        // show the original card again
        card.style.removeProperty('opacity');
        // remove the clone card
        cardClone.remove();
      });
      // fade the content away
      fadeContent(cardClone, '0')
        .then(() => {
          [...cardClone.children].forEach(child => child.style.display = 'none');
        });
      // expand the clone card
      await toggleExpansion(cardClone, {top: 0, left: 0, width: '100vw', height: '100vh'});
      const content = getCardContent(card.textContent, card.dataset.type)
      // set the display block so the content will follow the normal flow in case the original card is not display block
      cardClone.style.display = 'block';
      cardClone.style.padding = '0';
      // append the close button after the expansion is done
      cardClone.appendChild(closeButton);
      cardClone.insertAdjacentHTML('afterbegin', content);
    };

cards.forEach(card => card.addEventListener('click', onCardClick));
