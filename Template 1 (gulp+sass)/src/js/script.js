window.addEventListener("DOMContentLoaded", function () {

	const calcScroll = () => {
		let calcBox = document.createElement("div");
		calcBox.style.width = "50px";
		calcBox.style.height = "50px";
		calcBox.style.overflowY = "scroll";
		calcBox.style.visibility = "hidden";
		document.body.appendChild(calcBox);
		let scrollWidth = calcBox.offsetWidth - calcBox.clientWidth;
		calcBox.remove();

		return scrollWidth;
	};



	// modals
	const bindModals = (triggerSelectors, modalSelector, closeSelector) => {
		const triggers = document.querySelectorAll(triggerSelectors),
			modal = document.querySelector(modalSelector),
			close = document.querySelector(closeSelector),
			scrollWidth = calcScroll(),
			modalWindow = modal.querySelector(".popup__modal");

		const openModal = () => {
			modal.style.display = "block";
			modalWindow.classList.remove("fadeOutDown");
			modalWindow.classList.add("fadeInUp");
			document.querySelector("html").style.overflow = "hidden";
			document.querySelector("html").style.marginRight = `${scrollWidth}px`;
		};

		const closeModal = () => {
			modal.style.display = "none";
			document.querySelector("html").style.overflow = "";
			document.querySelector("html").style.marginRight = `0px`;
		};

		triggers.forEach(item => {
			item.addEventListener("click", (e) => {
				if (e.target) {
					e.preventDefault();
				}
				openModal();
			});
		});

		close.addEventListener("click", () => {
			modalWindow.classList.remove("fadeInUp");
			modalWindow.classList.add("fadeOutDown");

			const timeout = window.getComputedStyle(modalWindow).animationDuration.split("s")[0];
			setTimeout(() => {
				closeModal();
			}, timeout * 1000);
		});

		modal.addEventListener("click", (e) => {
			if (e.target === modal) {
				modalWindow.classList.remove("fadeInUp");
				modalWindow.classList.add("fadeOutDown");

				const timeout = window.getComputedStyle(modalWindow).animationDuration.split("s")[0];
				setTimeout(() => {
					closeModal();
				}, timeout * 1000);
			}
		});
	};



	// close by click popup-notification
	const popupNotificat = document.querySelector(".popup-notification");
	popupNotificat.addEventListener("click", (e) => {
		if (e.target == popupNotificat || e.target.classList.contains("popup__close") || e.target.classList.contains("popup__btn")) {
			popupNotificat.style.display = "none";
		};
	});


	// // smooth scrolling to anchors
	// const smoothScrolling = nav => {
	// 	const anchors = document.querySelectorAll('a[href*="#"]'),
	// 		nav = document.querySelector(nav);
	
	// 	for (let anchor of anchors) {
	// 		anchor.addEventListener('click', function (e) {
	// 			e.preventDefault()
	
	// 			const blockID = anchor.getAttribute('href').replace('#', '');
	
	// 			setTimeout(() => {
	// 				document.getElementById(blockID).scrollIntoView({
	// 					behavior: 'smooth',
	// 					block: 'start',
	// 				})
	// 			}, 500);
	// 		});
	// 	};
	// };


	// post data form
	const forms = () => {
		const forms = document.querySelectorAll("form"),
			inputs = document.querySelectorAll("input");

		const message = {
			successTitle: 'Ваша заявка успешно отправлена',
			successHint: 'Мы перезвоним Вам в течени 15 минут.<br>Спасибо, что выбираете качественный продукт',
			failureTitle: 'Что-то пошло не так...',
			failureHint: 'Попробуйте повторить позже.'
		};

		const clearInputs = () => {
			inputs.forEach(item => {
				try {
					item.closest(".focused").querySelector(".clean").style.display = "none";
					item.closest(".focused").classList.remove("focused");
				} catch (error) { }
				item.value = '';
				item.checked = false;
			})
		};

		const postData = async (url, data) => {
			let res = await fetch(url, {
				method: "post",
				body: data
			});
			return await res.text();
		};

		forms.forEach(item => {
			item.addEventListener('submit', (e) => {
				e.preventDefault()

				// cancel sending the form if there is no consent to the processing of personal data
				const checkbox = item.querySelector("[name='privacy-policy']");
				if (checkbox.checked) {
					const formData = new FormData(item);

					let notifModal = document.querySelector(".popup-notification"),
						notifTitle = notifModal.querySelector(".popup__title"),
						notifHint = notifModal.querySelector(".popup__hint"),
						btnLoad = item.querySelector('.form-callback__btn');

					btnLoad.classList.add("loader");

					postData('../contact.php', formData, btnLoad)
						.then(res => {
							console.log('\nSuccess POST\n', res);
							notifModal.style.display = "block";
							notifTitle.innerHTML = message.successTitle;
							notifHint.innerHTML = message.successHint;
							clearInputs();
						})
						.catch((error) => {
							console.error(`\nFailure POST\n${error}`);
							notifModal.style.display = "block";
							notifTitle.innerHTML = message.failureTitle;
							notifHint.innerHTML = message.failureHint;
						})
						.finally(() => {
							btnLoad.classList.remove("loader");
							setTimeout(() => {
								notifModal.style.display = "none";
							}, 5000);

						});

				} else {
					alert("Пожалуйста, согласитесь с обработкой персональных данных!");
				}
			});

		});
	};
	forms();




	// label input animation
	const animationInputLabel = () => {
		const inputsWrappers = document.querySelectorAll(".input-wrapper");
	
		inputsWrappers.forEach(inputWrapper => {
			const input = inputWrapper.querySelector("input"),
				clean = inputWrapper.querySelector(".clean");
	
			input.addEventListener("focus", function () {
				inputWrapper.classList.add("focused");
			});
	
			input.addEventListener("blur", function () {
				if (!this.value) {
					inputWrapper.classList.remove("focused");
					clean.style.display = "none";
				}
			})
	
			input.addEventListener("input", function () {
				if (this.value) {
					clean.style.display = "block";
				} else {
					clean.style.display = "none";
				}
			});
	
			clean.addEventListener("click", function () {
				this.style.display = "none";
				input.value = "";
				input.focus();
			});
	
		});
	};
	animationInputLabel();
});