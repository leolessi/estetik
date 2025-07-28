document.addEventListener("DOMContentLoaded", function () {
  var initialLocaleCode = "pt-br";
  // var localeSelectorEl = document.getElementById("locale-selector");
  var calendarEl = document.getElementById("calendar");

  var calendar = new FullCalendar.Calendar(calendarEl, {
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay",
    },
    buttonText: {
      today: "Hoje",
      month: "Mês",
      week: "Semana",
      day: "Dia",
    },
    dayHeaderFormat: {
      weekday: "short",
      month: undefined,
      day: undefined,
      year: undefined,
    },
    eventTimeFormat: {
      hour: "2-digit",
      minute: "2-digit",
      meridiem: false, // Remove AM/PM
    },
    locale: initialLocaleCode,
    timeZone: "America/Sao_Paulo",
    events: "getcalendar",
    eventClick: function (info) {
      window.location.href = "/event/" + info.event.id;
    },
    buttonIcons: true,
    navLinks: true,
    editable: true,
    dayMaxEvents: true,
  });

  calendar.render();
  const gotoInput = document.getElementById("goto-date");
  if (gotoInput) {
    gotoInput.addEventListener("change", function () {
      if (this.value) {
        calendar.gotoDate(this.value);
      }
    });
  }
});
//
//
//
//
/* <script>
document.addEventListener("DOMContentLoaded", function () {
  var initialLocaleCode = "pt-br";
  var localeSelectorEl = document.getElementById("locale-selector");
  var calendarEl = document.getElementById("calendar");

  var calendar = new FullCalendar.Calendar(calendarEl, {
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay",
    },
    buttonText: {
      today: "Hoje",
      month: "Mês",
      week: "Semana",
      day: "Dia",
    },
    dayHeaderFormat: {
      weekday: "short",
      month: undefined,
      day: undefined,
      year: undefined,
    },
    eventTimeFormat: {
      hour: "2-digit",
      minute: "2-digit",
      meridiem: false, // Remove AM/PM
    },
    locale: initialLocaleCode,
    timeZone: "America/Sao_Paulo",
    events: "getcalendar",
    eventClick: function (info) {
      window.location.href = "/event/" + info.event.id;
    },
    buttonIcons: true,
    navLinks: true,
    editable: true,
    dayMaxEvents: true,
  });

  calendar.render();
});
</script> */
