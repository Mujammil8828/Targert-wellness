/*! Copyright (c) 2016 THE ULTRASOFT (http://theultrasoft.com)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Project: Parallaxie
 * Version: 0.5
 *
 * Requires: jQuery 1.9+
 */

(function( $ ){
	"use strict";
    $.fn.parallaxie = function( options ){

        var options = $.extend({
            speed: 0.2,
            repeat: 'no-repeat',
            size: 'cover',
            pos_x: 'center',
            offset: 0,
        }, options );

        this.each(function(){

            var $el = $(this);
            var local_options = $el.data('parallaxie');
            if( typeof local_options !== 'object' ) local_options = {};
            local_options = $.extend( {}, options, local_options );

            var image_url = $el.data('image');
            if( typeof image_url === 'undefined' ){
                image_url = $el.css('background-image');
                if( !image_url ) return;

                // APPLY DEFAULT CSS
                var pos_y =  local_options.offset + ($el.offset().top - $(window).scrollTop()) * (1 - local_options.speed );
                $el.css({
                    'background-image': image_url,
                    'background-size': local_options.size,
                    'background-repeat': local_options.repeat,
                    'background-attachment': 'fixed',
                    'background-position': local_options.pos_x + ' ' + pos_y + 'px',
                });

                $(window).scroll( function(){
                        //var pos_y = - ( $(window).scrollTop() - $el.offset().top ) * ( 1 + local_options.speed ) - ( $el.offset().top * local_options.speed );
                        var pos_y =  local_options.offset + ($el.offset().top - $(window).scrollTop()) * (1 - local_options.speed );
                        $el.data( 'pos_y', pos_y );
                        $el.css( 'background-position', local_options.pos_x + ' ' + pos_y + 'px' );
                    }
                );
            }
        });
        return this;
    };
}( jQuery ));



    
        let currentSlide = 0;
        const slides = document.querySelectorAll('.slide');
        const dots = document.querySelectorAll('.dot');
        const totalSlides = slides.length;
        const slider = document.querySelector('.slider');
        const progressBar = document.getElementById('progressBar');
        let autoSlideInterval;
        let progressInterval;

        function showSlide(slideIndex) {
            if (slideIndex >= totalSlides) currentSlide = 0;
            else if (slideIndex < 0) currentSlide = totalSlides - 1;
            else currentSlide = slideIndex;

            slider.style.transform = `translateX(-${currentSlide * 100}%)`;
            
            // Update dots
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
            
            // Reset progress bar
            resetProgressBar();
        }

        function nextSlide() {
            showSlide(currentSlide + 1);
        }

        function prevSlide() {
            showSlide(currentSlide - 1);
        }

        function startAutoSlide() {
            // Clear existing intervals
            stopAutoSlide();
            
            // Start new interval for sliding
            autoSlideInterval = setInterval(nextSlide, 4000);
            
            // Start progress bar animation
            startProgressBar();
        }

        function stopAutoSlide() {
            clearInterval(autoSlideInterval);
            clearInterval(progressInterval);
            progressBar.style.width = '0%';
        }

        function startProgressBar() {
            let width = 0;
            clearInterval(progressInterval);
            
            progressInterval = setInterval(() => {
                if (width >= 100) {
                    clearInterval(progressInterval);
                } else {
                    width += 0.5; // 4 seconds = 4000ms, 100% in 2000 steps
                    progressBar.style.width = width + '%';
                }
            }, 20);
        }

        function resetProgressBar() {
            progressBar.style.width = '0%';
            startProgressBar();
        }

        // Event listeners for buttons
        document.querySelector('.next').addEventListener('click', () => {
            nextSlide();
            stopAutoSlide();
            startAutoSlide();
        });

        document.querySelector('.prev').addEventListener('click', () => {
            prevSlide();
            stopAutoSlide();
            startAutoSlide();
        });

        // Dot click events
        dots.forEach(dot => {
            dot.addEventListener('click', function() {
                showSlide(parseInt(this.getAttribute('data-slide')));
                stopAutoSlide();
                startAutoSlide();
            });
        });

        // Pause auto-slide on hover
        document.querySelector('.slider-container').addEventListener('mouseenter', stopAutoSlide);
        document.querySelector('.slider-container').addEventListener('mouseleave', startAutoSlide);

        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft') {
                prevSlide();
                stopAutoSlide();
                startAutoSlide();
            }
            if (e.key === 'ArrowRight') {
                nextSlide();
                stopAutoSlide();
                startAutoSlide();
            }
        });

        // Start auto-slide initially
        startAutoSlide();

        // Touch swipe support for mobile
        let startX = 0;
        document.querySelector('.slider-container').addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            stopAutoSlide();
        });

        document.querySelector('.slider-container').addEventListener('touchend', (e) => {
            let endX = e.changedTouches[0].clientX;
            if (startX - endX > 50) nextSlide(); // Swipe left
            if (endX - startX > 50) prevSlide(); // Swipe right
            startAutoSlide();
        });
 