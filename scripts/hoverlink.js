// this is how i'm making my "link.svg" change color.
// in reality its jsut swapping two images on hover.

document.addEventListener("DOMContentLoaded", () => {

  // finds the images who have 'Link' as their alt
  document.querySelectorAll('img[alt="Link"]').forEach(img => {

    // keep track of the sources
    const originalSrc = img.src;
    const hoverSrc = "resources/images/link2.svg"; // our "colored" link is link2.svg

    // on hover change to the hover color
    img.addEventListener("mouseenter", () => {
      img.src = hoverSrc;
    });

    // when we stop hovering go back
    img.addEventListener("mouseleave", () => {
      img.src = originalSrc;
    });
  });
});
