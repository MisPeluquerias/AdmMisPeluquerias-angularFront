import { __decorate } from "tslib";
import { Component } from '@angular/core';
let EditHomeComponent = class EditHomeComponent {
    constructor(route, editHomeService, toastr, modalService, cdr) {
        this.route = route;
        this.editHomeService = editHomeService;
        this.toastr = toastr;
        this.modalService = modalService;
        this.cdr = cdr;
        this.getCategories = [];
        this.salonId = 0;
        this.salonData = {
            id_salon: '',
            id_city: '',
            id_province: '',
            plus_code: '',
            active: '',
            state: '',
            in_vacation: '',
            name: '',
            address: '',
            latitud: '',
            longitud: '',
            email: '',
            url: '',
            phone: '',
            map: '',
            iframe: '',
            image: '',
            about_us: '',
            score_old: '',
            hours_old: '',
            zip_code_old: '',
            overview_old: '',
            created_at: '',
            updated_at: '',
            deleted_at: '',
            categories: '',
            city_name: '',
            city_zip_code: '',
            sortedHours: []
        };
        this.provinces = [];
        this.cities = [];
        this.additionalComments = '';
        this.dias = [];
        this.getSalonServices = [];
        this.totalItems = 0;
        this.currentPage = 1;
        this.pageSize = 10;
        this.selectedFile = null;
        this.images = [];
        this.ratings = {
            service: [false, false, false, false, false],
            quality: [false, false, false, false, false],
            cleanliness: [false, false, false, false, false],
            speed: [false, false, false, false, false]
        };
        this.fileDescription = '';
        this.fileGroup = '';
        this.filePrincipal = false;
        this.fileActive = true;
        this.currentImageUrl = '';
        this.currentImageAlt = '';
        this.isImageOpen = false;
        this.services = [];
        this.newServiceName = '';
        this.newSubservices = '';
        this.newServiceTime = 0;
        this.selectedService = {};
        this.selectedSubservice = {};
        this.totalPages = 1;
        this.getSalonDataSelect = [];
        this.faqByIdSalon = [];
        this.editAnswerText = '';
        this.editQuestionText = '';
        this.reviews = [];
        this.editRating = '';
        this.editReviewText = '';
        this.responseReviewText = '';
        this.averageRating = 0;
        this.averageRatingStart = 0;
        this.getSalonSubservices = ['Seleccione una opción'];
        this.selectedServiceId = null;
        this.selectedServiceName = null;
        this.idSalonServiceType = null;
        this.selectedCategory = {};
        this.oldCategory = '';
        this.userPermiso = '';
        this.brands = [];
        this.responseText = '';
        this.days = [
            { name: 'Lunes', hours: [] },
            { name: 'Martes', hours: [] },
            { name: 'Miércoles', hours: [] },
            { name: 'Jueves', hours: [] },
            { name: 'Viernes', hours: [] },
            { name: 'Sábado', hours: [] },
            { name: 'Domingo', hours: [] }
        ];
    }
    ngOnInit() {
        this.route.paramMap.subscribe((params) => {
            const id = params.get('id');
            this.salonId = id ? +id : 0; // Convierte el ID a número, asegurándote de que es un valor válido
            this.loadProvinces();
            this.loadImages();
            this.getUniqueServices();
            this.getServicesWithSubservices();
            this.getFaqByIdSalon();
            this.getReviewsById();
            this.getCategoriesModal();
            this.selectedCategory = '';
        });
        this.getUserPermiso();
    }
    getUserPermiso() {
        // Llama al método del servicio para obtener el permiso del usuario
        this.editHomeService.getUserPermiso().subscribe({
            next: (response) => {
                // Asigna el permiso obtenido a la variable userPermission
                this.userPermiso = response.permiso;
                //console.log('Permiso de usuario',this.userPermiso); // Ajusta esto según la estructura del objeto recibido
            },
            error: (error) => {
                console.error('Error al obtener el permiso del usuario:', error);
                // Manejo de errores si es necesario
            }
        });
    }
    generateStars(rating) {
        return Array(5).fill(0).map((_, i) => {
            if (i < Math.floor(rating)) {
                return 'fas fa-star'; // Estrella llena
            }
            else if (i === Math.floor(rating) && rating % 1 !== 0) {
                return 'fas fa-star-half-alt'; // Media estrella
            }
            else {
                return 'far fa-star'; // Estrella vacía
            }
        }).reverse();
    }
    openImage(url, alt) {
        this.currentImageUrl = url;
        this.currentImageAlt = alt;
        this.isImageOpen = true;
    }
    closeImage() {
        this.isImageOpen = false;
    }
    loadProvinces() {
        this.editHomeService.getProvinces().subscribe((response) => {
            this.provinces = response.data;
            if (this.salonId) {
                this.getSalonData(this.salonId);
            }
        }, (error) => {
            console.error('Error fetching provinces:', error);
        });
    }
    generateStarRatingArray(rating) {
        const totalStars = 5;
        const fullStars = Math.floor(rating); // Número de estrellas completas
        const halfStar = rating % 1 >= 0.5 ? 1 : 0; // Media estrella si corresponde
        const emptyStars = totalStars - fullStars - halfStar; // Estrellas vacías
        return [
            ...Array(fullStars).fill(1), // Estrellas completas
            ...Array(halfStar).fill(0.5), // Media estrella
            ...Array(emptyStars).fill(0) // Estrellas vacías
        ];
    }
    getSalonData(id_salon) {
        this.editHomeService.getSalonById(id_salon).subscribe((response) => {
            this.salonData = response.data;
            this.averageRatingStart = this.salonData.average_rating || 0;
            console.log('salonData', this.salonData);
            // Verificar si las categorías existen y no son nulas
            if (this.salonData.categories && this.salonData.categories.trim() !== '') {
                try {
                    // Convierte la cadena en un formato de array JSON válido
                    const formattedCategories = `[${this.salonData.categories.replace(/\\/g, '')}]`;
                    const categoryArray = JSON.parse(formattedCategories);
                    // Verificar si el array contiene elementos válidos
                    if (categoryArray.length === 1 && categoryArray[0].id_category === null) {
                        this.salonData.categoriesArray = []; // Asignar un array vacío si no hay categorías válidas
                    }
                    else {
                        this.salonData.categoriesArray = categoryArray; // Asignarlo si es válido
                    }
                }
                catch (error) {
                    console.error('Error parsing categories:', error);
                    this.salonData.categoriesArray = []; // Asignamos un array vacío en caso de error
                }
            }
            else {
                // Si no hay categorías o está vacío, asignar un array vacío
                this.salonData.categoriesArray = [];
            }
            if (this.salonData.id_province) {
                this.onProvinceChange(this.salonData.id_province, true);
            }
            // Procesa los horarios antiguos si existen
            if (this.salonData.hours_old) {
                try {
                    const hoursArray = this.salonData.hours_old.split('; ').map((dayText) => {
                        const [day, hours] = dayText.split(': ');
                        return {
                            day: day.trim(),
                            hours: hours
                                ? hours.split(', ').map((hour) => {
                                    const [open, close] = hour.split('-');
                                    return { open: open.trim(), close: close.trim() };
                                })
                                : [],
                        };
                    });
                    this.salonData.hours = hoursArray;
                    this.days.forEach((day) => {
                        const matchingHours = hoursArray.find((h) => h.day === day.name);
                        day.hours = matchingHours ? matchingHours.hours : [];
                    });
                }
                catch (error) {
                    console.error('Error parsing hours:', error);
                    this.salonData.hours = [];
                }
            }
        }, (error) => {
            console.error('Error fetching salon data:', error);
        });
    }
    updateRatings(ratingArray, index) {
        // Marca los checkboxes anteriores si uno es seleccionado
        if (ratingArray[index]) {
            for (let i = 0; i <= index; i++) {
                ratingArray[i] = true;
            }
        }
        else {
            // Desmarca los checkboxes siguientes si uno es deseleccionado
            for (let i = index + 1; i < ratingArray.length; i++) {
                ratingArray[i] = false;
            }
        }
    }
    addHour(day) {
        if (day.hours.length < 2) {
            day.hours.push({ open: '', close: '' }); // Añade una nueva franja horaria vacía
        }
    }
    removeHour(day, index) {
        day.hours.splice(index, 1); // Elimina la franja horaria seleccionada
    }
    saveHours() {
        const hoursToSave = this.days.map(day => ({
            day: day.name,
            // Especifica el tipo de `hour` como `{ open: string; close: string }`
            hours: day.hours.filter((hour) => hour.open && hour.close)
        }));
        const hours_old = hoursToSave
            .map(day => `${day.day}: ${day.hours.map(hour => `${hour.open}-${hour.close}`).join(', ')}`)
            .join('; '); // Convierte los horarios a texto plano
        this.editHomeService.updateSalonHours(this.salonId, hours_old).subscribe(response => {
            this.toastr.success('Horarios guardados correctamente');
            console.log('Horas guardadas:', hours_old);
        }, error => {
            this.toastr.error('Error al guardar los horarios');
            console.error('Error al guardar los horarios:', error);
        });
    }
    updateSalon() {
        if (!this.salonData.id_city) {
            this.toastr.warning("Por favor, seleccione una ciudad para actualizar los datos");
            return;
        }
        if (!this.salonData.name) {
            this.toastr.warning("Por favor, ingrese el nombre del salón");
            return;
        }
        if (!this.salonData.email) {
            this.toastr.warning("Por favor, ingrese el correo electrónico del salón");
            return;
        }
        if (!this.salonData.address) {
            this.toastr.warning("Por favor, ingrese la dirección del salón");
            return;
        }
        if (!this.salonData.phone) {
            this.toastr.warning("Por favor, ingrese el número de teléfono del salón");
            return;
        }
        if (!this.salonData.id_province) {
            this.toastr.warning("Por favor, seleccione una provincia");
            return;
        }
        if (!this.salonData.latitud) {
            this.toastr.warning("Por favor, ingrese la latitud");
            return;
        }
        if (!this.salonData.longitud) {
            this.toastr.warning("Por favor, ingrese la longitud");
            return;
        }
        //console.log(this.salonData);
        this.editHomeService.updateSalon(this.salonData).subscribe((response) => {
            console.log('Salon updated successfully', response);
            this.toastr.success('<i class="las la-info-circle"> Cambios realizados con éxito</i>');
        }, (error) => {
            console.error('Error updating salon', error);
            this.toastr.error('<i class="las la-info-circle"> No se realizaron los cambios</i>');
            this.getSalonData(this.salonId);
        });
    }
    onProvinceChange(provinceId, initialLoad = false) {
        if (!initialLoad) {
            this.salonData.id_city = '';
            this.salonData.city_name = '';
        }
        this.editHomeService.getCitiesByProvince(provinceId).subscribe((response) => {
            this.cities = response.data;
            if (initialLoad && this.salonData.id_city) {
                const selectedCity = this.cities.find((city) => city.id_city === this.salonData.id_city);
                if (selectedCity) {
                    this.salonData.city_name = selectedCity.city_name;
                }
            }
        }, (error) => {
            console.error('Error fetching cities:', error);
        });
    }
    onCityChange(cityId) {
        const selectedCity = this.cities.find((city) => city.id_city === cityId);
        if (selectedCity) {
            this.salonData.city_name = selectedCity.city_name;
            this.salonData.id_city = selectedCity.id_city;
        }
    }
    toggleManana(dia) {
        if (dia.cerradoManana) {
            dia.mananaInicio = '';
            dia.mananaFin = '';
        }
    }
    toggleTarde(dia) {
        if (dia.cerradoTarde) {
            dia.tardeInicio = '';
            dia.tardeFin = '';
        }
    }
    onFileSelected(event) {
        this.selectedFile = event.target.files[0];
    }
    onUpload() {
        if (!this.selectedFile) {
            this.toastr.error('<i class="las la-info-circle">Por favor, seleccione una imagen primero.</i>');
            return;
        }
        const formData = new FormData();
        formData.append('image', this.selectedFile);
        formData.append('file_name', this.selectedFile.name);
        formData.append('file_description', this.fileDescription);
        formData.append('file_group', this.fileGroup);
        formData.append('file_principal', this.filePrincipal ? '1' : '0');
        formData.append('file_active', this.fileActive ? '1' : '0');
        formData.append('salon_id', this.salonId.toString()); // Convertir a string
        this.editHomeService.uploadImage(formData).subscribe(response => {
            console.log('Image uploaded successfully', response);
            this.loadImages(); // Recargar las imágenes después de la subida
        }, error => console.error('Error uploading image', error));
    }
    loadImages() {
        this.editHomeService.getImages(this.salonId).subscribe((response) => {
            if (response.success) {
                this.images = response.data;
            }
            else {
                console.error('Error fetching images', response);
            }
        }, (error) => {
            console.error('Error fetching images', error);
        });
    }
    setToDeleteImage(imageId) {
        this.idImageToDelete = imageId;
    }
    confirmDeleteImage() {
        this.editHomeService.deleteImage(this.idImageToDelete).subscribe(response => {
            this.toastr.success('Imagen eliminada con éxito');
            //console.log('Image deleted successfully', response);
            this.loadImages(); // Recargar la lista de imágenes
        }, error => {
            this.toastr.error('Error al eliminar la imagen');
            console.error('Error deleting image', error);
        });
    }
    uniqueCheckboxSelectImge(index) {
        const selectedImage = this.images[index];
        if (selectedImage.file_principal) {
            // Si el checkbox se ha marcado, desmarcar todos los demás y actualizar el backend
            this.images.forEach((image, i) => {
                if (i !== index) {
                    image.file_principal = false;
                    this.updatePrincipalmage(image.file_id, false); // Desmarcar en el backend
                }
            });
        }
        // Actualizar el estado de la imagen seleccionada en el backend
        this.updatePrincipalmage(selectedImage.file_id, selectedImage.file_principal);
    }
    updatePrincipalmage(fileId, filePrincipal) {
        this.editHomeService.updatePrincipalImage(fileId, filePrincipal).subscribe({
            next: (response) => {
                // console.log('Image status updated successfully', response);
                // Aquí puedes manejar el éxito, por ejemplo, mostrar un mensaje al usuario
            },
            error: (error) => {
                console.error('Failed to update image status', error);
                // Aquí puedes manejar el error, por ejem[(ngModel)]="salonData.state"plo, mostrar un mensaje de error
            }
        });
    }
    getUniqueServices() {
        this.editHomeService.getServices().subscribe((response) => {
            if (response.success) {
                this.getSalonDataSelect = response.data;
                //console.log('Servicios cargados',this.getSalonServices); // Usa este valor para gestionar la paginación en el frontend
            }
            else {
                console.error('Error fetching services', response);
            }
        }, (error) => {
            console.error('Error fetching services ', error);
        });
    }
    onServiceSelect(event) {
        const target = event.target;
        this.selectedServiceId = +target.value; // Convierte el valor a número
        const selectedService = this.getSalonDataSelect.find(service => service.id_service === this.selectedServiceId);
        if (selectedService) {
            this.selectedServiceName = selectedService.name;
        }
        this.getSubservicesByService(this.selectedServiceId);
        console.log('ID del servicio seleccionado:', this.selectedServiceId);
        console.log('Nombre del servicio seleccionado:', this.selectedServiceName);
    }
    getSubservicesByService(id_service) {
        this.editHomeService.getSubservicesByService(id_service).subscribe((response) => {
            if (response.success) {
                this.getSalonSubservices = response.data;
                console.log('Subservicios cargados:', this.getSalonSubservices);
            }
            else {
                console.error('Error al cargar los subservicios', response);
            }
        }, (error) => {
            console.error('Error al obtener subservicios', error);
        });
    }
    addService() {
        // Verifica que selectedServiceName no esté vacío antes de proceder
        if (!this.selectedServiceName) {
            this.toastr.error('Por favor, selecciona un servicio válido.');
            return;
        }
        if (this.selectedSubservice === null || this.selectedSubservice === undefined) {
            this.toastr.error('El Subservicio seleccionado es necesario para la actualización.');
            return;
        }
        if (this.newServiceTime === null || this.newServiceTime === undefined || this.newServiceTime <= 0) {
            this.toastr.error('El tiempo del servicio debe ser un valor válido y mayor a cero.');
            return;
        }
        // Asegúrate de enviar selectedServiceName en lugar de newServiceName
        this.editHomeService.addService(this.salonId, this.selectedServiceId, this.newSubservices, this.newServiceTime).subscribe((response) => {
            if (response.success) {
                this.toastr.success('Servicio agregado con éxito');
                this.getServicesWithSubservices(); // Recargar la lista de servicios
            }
            else {
                this.toastr.error('Error al agregar el servicio');
            }
        }, (error) => {
            console.error('Error adding service:', error);
            this.toastr.error('Error al agregar el servicio');
        });
    }
    getServicesWithSubservices() {
        this.editHomeService.getServicesWithSubservices(this.salonId).subscribe((response) => {
            if (response.data) {
                // Asignar los datos, incluso si están vacíos
                this.getSalonServices = response.data;
                //console.log('Servicios actualizados:', this.getSalonServices);
                // Maneja el caso de array vacío
                if (this.getSalonServices.length === 0) {
                    console.warn('No hay servicios disponibles.');
                }
            }
            else {
                console.error('Formato de respuesta incorrecto', response);
                this.getSalonServices = []; // Limpia la lista si el formato es incorrecto
            }
        }, (error) => {
            console.error('Error al obtener servicios con subservicios', error);
        });
    }
    changePage(page) {
        if (page > 0 && page <= this.totalPages) {
            this.currentPage = page;
            this.getServicesWithSubservices();
        }
    }
    getPagesArray() {
        return Array(this.totalPages).fill(0).map((x, i) => i + 1);
    }
    deleteServiceWithSubservice(id_salon_service_type) {
        if (confirm('¿Estás seguro de que quieres eliminar este servicio?')) {
            this.editHomeService.deleteServiceWithSubservice(id_salon_service_type).subscribe((response) => {
                if (response.success) {
                    this.getServicesWithSubservices();
                    this.toastr.success('Servicio eliminado con éxito');
                    // Refresca la lista de servicios
                }
                else {
                    this.toastr.error('Error al eliminar el servicio');
                }
            }, (error) => {
                console.error('Error deleting service:', error);
                this.toastr.error('Error al eliminar el servicio');
            });
        }
    }
    updateQuestion() {
        const updatedQuestion = {
            id_faq: this.faqToEdit.id_faq,
            answer: this.editAnswerText || "",
        };
        this.editHomeService.updateFaq(updatedQuestion.id_faq, updatedQuestion.answer).subscribe(response => {
            this.toastr.success('Pregunta respondida con éxito');
            this.getFaqByIdSalon();
        }, error => console.error('Error actualizando la pregunta', error));
    }
    getFaqByIdSalon() {
        this.editHomeService.getFaqByIdSalon(this.salonId, this.currentPage, this.pageSize).subscribe((response) => {
            if (response.success) {
                this.faqByIdSalon = response.data;
                this.totalItems = response.total;
                this.totalPages = Math.ceil(this.totalItems / this.pageSize);
                //console.log('FAQs loaded successfully', this.faqByIdSalon);
            }
            else {
                console.error('Error fetching FAQs', response);
            }
        }, (error) => {
            console.error('Error fetching FAQs', error);
        });
    }
    editQuestion(faq) {
        this.faqToEdit = faq;
        this.editQuestionText = faq.question;
        this.editAnswerText = faq.answer;
    }
    getReviewsById() {
        this.editHomeService.loadReview(this.salonId).subscribe(reviews => {
            this.reviews = reviews.map(review => {
                review.stars = this.generateStars(review.qualification); // Generar las estrellas para cada reseña
                return review;
            });
            //console.log('reseñas cargadas',this.reviews);
        }, error => console.error('Error loading reviews', error));
    }
    updateReview() {
        const updatedReview = {
            ...this.reviewToEdit, // Mantener otros datos de la reseña
            observacion: this.additionalComments,
            qualification: {
                service: this.countSelectedRatings(this.ratings.service),
                quality: this.countSelectedRatings(this.ratings.quality),
                cleanliness: this.countSelectedRatings(this.ratings.cleanliness),
                speed: this.countSelectedRatings(this.ratings.speed),
            }
        };
        // Llamada al servicio para actualizar la reseña en el backend
        this.editHomeService.updateReview(updatedReview).subscribe({
            next: () => {
                this.toastr.success('Reseña actualizada con éxito');
                this.getReviewsById();
            },
            error: (error) => {
                //console.error('Error al actualizar la reseña:', error);
                this.toastr.error('No se pudo actualizar la reseña.');
            }
        });
    }
    countSelectedRatings(ratingArray) {
        return ratingArray.filter(Boolean).length;
    }
    openEditModal(service) {
        // Clona el objeto del servicio seleccionado
        this.selectedService = { ...service };
        // Asigna los valores necesarios
        this.newServiceName = this.selectedService.id_service; // ID del servicio seleccionado
        this.newServiceTime = this.selectedService.time;
        // Asigna el ID de Salon Service Type
        this.idSalonServiceType = this.selectedService.id_salon_service_type; // Asegúrate de que este valor exista en el objeto `service`
        // Cargar los subservicios correspondientes al servicio seleccionado
        this.editHomeService.getSubservicesByService(this.selectedService.id_service).subscribe((response) => {
            if (response.success) {
                // Asigna los subservicios cargados a la lista correspondiente
                this.getSalonSubservices = response.data;
                // Una vez cargados los subservicios, asigna el subservicio seleccionado
                this.newSubservices = this.selectedService.id_service_type.toString();
                // Verificación: imprimir los valores asignados
                console.log('Servicio seleccionado:', this.newServiceName);
                console.log('Subservicio seleccionado:', this.newSubservices);
                console.log('ID de Salon Service Type:', this.idSalonServiceType);
            }
            else {
                console.error('Error al cargar los subservicios:', response.message);
            }
        }, (error) => {
            console.error('Error al obtener subservicios:', error);
        });
    }
    onSubserviceSelect(event) {
        const target = event.target;
        this.selectedSubservice = +target.value; // Asegúrate de que sea un número
        console.log('Subservicio seleccionado:', this.selectedSubservice);
    }
    updateServiceWithSubservice() {
        // Validaciones detalladas para identificar qué dato falta
        if (this.idSalonServiceType === null || this.idSalonServiceType === undefined) {
            this.toastr.error('El ID de Salon Service Type es necesario para la actualización.');
            return;
        }
        if (this.selectedServiceId === null || this.selectedServiceId === undefined) {
            this.toastr.error('El ID del Servicio seleccionado es necesario para la actualización.');
            return;
        }
        if (this.selectedSubservice === null || this.selectedSubservice === undefined) {
            this.toastr.error('El Subservicio seleccionado es necesario para la actualización.');
            return;
        }
        if (this.newServiceTime === null || this.newServiceTime === undefined || this.newServiceTime <= 0) {
            this.toastr.error('El tiempo del servicio debe ser un valor válido y mayor a cero.');
            return;
        }
        // Crear el objeto con los datos para la actualización
        const updateData = {
            idSalonServiceType: this.idSalonServiceType,
            idService: this.selectedServiceId,
            idServiceType: this.selectedSubservice,
            time: this.newServiceTime,
            active: 1, // Cambia si necesitas actualizarlo de manera diferente
        };
        // Llamada al servicio para actualizar el servicio con los subservicios
        this.editHomeService.updateServiceWithSubservice(updateData).subscribe((response) => {
            if (response.success) {
                this.toastr.success('Servicio actualizado con éxito');
                this.getServicesWithSubservices(); // Recargar la lista de servicios
                this.modalService.dismissAll(); // Cerrar el modal de edición
            }
            else {
                this.toastr.error('Error al actualizar el servicio');
            }
        }, (error) => {
            console.error('Error updating service:', error);
            this.toastr.error('Error al actualizar el servicio');
        });
    }
    openEditModalToReview(review) {
        this.reviewToEdit = review;
        //console.log('Observation',observation);
        // Usamos la calificación general para todas las categorías
        const overallRating = review.qualification;
        // Llenamos todas las categorías con la misma calificación general
        this.ratings = {
            service: this.getCheckboxState(review.servicio),
            quality: this.getCheckboxState(review.calidad_precio),
            cleanliness: this.getCheckboxState(review.limpieza),
            speed: this.getCheckboxState(review.puntualidad),
        };
        // Asignar los comentarios adicionales
        this.additionalComments = review.observacion;
        this.responseText = review.respuesta;
        //console.log('Estado de ratings:', this.ratings);
    }
    updateReviewModal() {
        const review = {
            ...this.reviewToEdit, // Mantener otros datos de la reseña
            observacion: this.additionalComments,
            respuesta: this.responseText,
            qualification: {
                service: this.countSelectedRatings(this.ratings.service),
                quality: this.countSelectedRatings(this.ratings.quality),
                cleanliness: this.countSelectedRatings(this.ratings.cleanliness),
                speed: this.countSelectedRatings(this.ratings.speed),
            }
        };
        // Llamada al servicio para actualizar la reseña en el backend
        this.editHomeService.updateReview(review).subscribe({
            next: () => {
                this.toastr.success('Reseña actualizada con éxito');
                this.getReviewsById();
                // Refrescar todos los datos
                // Recargar las puntuaciones
            },
            error: (error) => {
                //console.error('Error al actualizar la reseña:', error);
                this.toastr.error('No se pudo actualizar la reseña.');
            }
        });
    }
    openResponseModalReview(review) {
        this.reviewToEdit = review; // Aquí aseguramos que toda la reseña se asigne correctamente
        this.editReviewText = review.observacion;
        this.responseText = review.respuesta;
    }
    getCheckboxState(rating) {
        return [1, 2, 3, 4, 5].map((val) => val <= rating);
    }
    confirmResponseReview() {
        const responseReview = {
            id_review: this.reviewToEdit.id_review, // Asegúrate de que reviewToEdit contiene id_review
            respuesta: this.responseText || ""
        };
        this.editHomeService.responseReview(responseReview).subscribe(response => {
            console.log('Reseña actualizada:', response);
            this.toastr.success('Reseña constestada con éxito');
            this.getReviewsById();
        }, error => {
            this.toastr.error('Error al actualizar la respuesta de la reseña');
            console.error('Error actualizando la reseña', error);
            //console.log('responseReview id:', this.reviewToEdit?.id_review);
            //console.log('responseReview respuesta:', this.responseText);
        });
    }
    addCategorySalon() {
        if (!this.selectedCategory) {
            this.toastr.warning('Por favor, selecciona una categoría.'); // Mostrar advertencia si no se seleccionó ninguna categoría
            return;
        }
        // Llama al servicio para añadir la categoría seleccionada al salón
        this.editHomeService.addCategorySalon(this.salonId, this.selectedCategory).subscribe((response) => {
            this.toastr.success('Categoría añadida correctamente.');
            // Opcional: Puedes actualizar la lista de categorías o realizar otra acción después de añadir la categoría
            this.getSalonData(this.salonId);
        }, (error) => {
            this.toastr.error('Error al añadir la categoría.');
            console.error('Error:', error);
        });
        // Reiniciar la categoría seleccionada
        this.selectedCategory = '';
    }
    getCategoriesModal() {
        this.editHomeService.getCategories().subscribe((response) => {
            // Verifica si response tiene datos en la propiedad data
            if (response.data && response.data.length > 0) {
                this.getCategories = response.data;
                //console.log('Categorias cargadas', this.getCategories);
            }
            else {
                console.error('No se encontraron categorías', response);
            }
        }, (error) => {
            console.error('Error fetching categories', error);
        });
    }
    onEditCategory(category) {
        // Hacer una copia de la categoría seleccionada
        this.selectedCategory = { ...category };
        console.log('Categoría seleccionada para editar:', this.selectedCategory.category);
    }
    onDeleteCategory(category) {
        this.selectedCategory = { ...category };
    }
    // Función para actualizar la categoría
    updateCategory() {
        if (this.selectedCategory && this.selectedCategory.id_category) {
            const updateData = {
                idSalon: this.salonId,
                id_category: this.selectedCategory.id_category, // ID de la categoría
                categories: this.selectedCategory.category // Nuevo nombre de la categoría
            };
            this.editHomeService.updateCategorySalon(updateData).subscribe((response) => {
                console.log('Categoría actualizada:', this.selectedCategory);
                this.toastr.success('Categoría actualizada correctamente.');
                this.getSalonData(this.salonId); // Actualiza la lista de categoríasp
            }, (error) => {
                console.error('Error al actualizar la categoría:', error);
                this.toastr.error('Error al actualizar la categoría.');
            });
        }
        else {
            this.toastr.warning('Por favor, selecciona una categoría para actualizar.');
        }
        console.log('Id salon', this.salonId);
        console.log('id category', this.selectedCategory.id_category);
        console.log('category name', this.selectedCategory.category);
    }
    openDeleteModal(id_category) {
        this.idCategoryToDelete = id_category; // Guarda el ID de la categoría a eliminar
    }
    openDeleteServiceModal(id_salon_service_type) {
        this.idServiceToDelete = id_salon_service_type; // Guarda el ID del servicio a eliminar
    }
    confirmDeleteCategory() {
        this.editHomeService.deleteCategorySalon(this.idCategoryToDelete).subscribe((response) => {
            this.toastr.success('Categoría eliminada exitosamente', 'Éxito');
            this.getSalonData(this.salonId); // Recarga los datos después de eliminar
        }, (error) => {
            this.toastr.error('Error al eliminar la categoría', 'Error');
        });
    }
    confirmDeleteService() {
        this.editHomeService.deleteServiceWithSubservice(this.idServiceToDelete).subscribe((response) => {
            this.toastr.success('Servicio eliminado exitosamente', 'Éxito');
            // Recarga la lista de servicios después de eliminar
            this.getServicesWithSubservices();
            this.cdr.detectChanges();
        }, (error) => {
            this.toastr.error('Error al eliminar el servicio', 'Error');
        });
    }
    setToDeleteFaq(id_faq) {
        this.idFaqToDelete = id_faq; // Guarda el ID de la pregunta a eliminar
    }
    confirmDeleteFaq() {
        this.editHomeService.deleteFaq(this.idFaqToDelete).subscribe((response) => {
            this.toastr.success('Pregunta eliminada exitosamente', 'Éxito');
            this.getFaqByIdSalon();
        }, (error) => {
            this.toastr.error('Error al eliminar la pregunta', 'Error');
        });
    }
    setToDeleteReview(id_review) {
        this.idReviewToDelete = id_review;
    }
    confirmDeleteReview() {
        console.log('Id del review a eliminar', this.idReviewToDelete);
        if (this.idReviewToDelete) {
            this.editHomeService.deleteReview(this.idReviewToDelete).subscribe(response => {
                this.toastr.success('Reseña eliminada con éxito');
                this.getReviewsById();
            }, error => console.error('Error eliminando la Reseña', error));
        }
        else {
            console.error('No se encontró el ID de la reseña.');
        }
    }
    getAllBrands() {
        this.editHomeService.getBrands().subscribe({
            next: (response) => {
                this.brands = response; // Asigna la respuesta a la variable `allBrands`
                console.log('marcas recividas', this.brands);
            },
            error: (err) => {
                console.error('Error al obtener las marcas:', err);
                this.toastr.error('Hubo un error al cargar las marcas', 'Error');
            }
        });
    }
};
EditHomeComponent = __decorate([
    Component({
        selector: 'app-edit-home',
        templateUrl: './edit-home.component.html',
        styleUrls: ['./edit-home.component.scss'],
    })
], EditHomeComponent);
export { EditHomeComponent };
//# sourceMappingURL=edit-home.component.js.map