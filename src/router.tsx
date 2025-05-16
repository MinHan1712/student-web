
import Classes from "./pages/Classes";
import ClassesDetails from "./pages/ClassesDetails";
import Course from "./pages/Course";
import FacultiesDetails from "./pages/FaculitesDetails";
import FacultiesList from "./pages/Faculties";
import Students from "./pages/Students";
import Teachers from "./pages/Teachers";
import TeachesDetails from "./pages/TeachesDetails";


const routes = [
	{
		index: true,
		element: (
			<Course />
		),
		state: "course",
		path: "course",
	},
	{
		index: true,
		element: (
			<Teachers />
		),
		state: "teaches",
		path: "teaches",
	},
		{
		index: true,
		element: (
			<Students />
		),
		state: "students",
		path: "students",
	},
	{
		index: true,
		element: (
			<Classes />
		),
		state: "classes",
		path: "classes",
	},
	{
		index: true,
		element: (
			<FacultiesList />
		),
		state: "faculties",
		path: "faculties",
	},
	{
		index: true,
		element: (
			<FacultiesDetails />
		),
		state: "faculties/details",
		path: "faculties/details",
	},
	{
		index: true,
		element: (
			<ClassesDetails />
		),
		state: "classes/details",
		path: "classes/details",
	},
	{
		index: true,
		element: (
			<TeachesDetails />
		),
		state: "teaches/details",
		path: "teaches/details",
	},
];

export default routes;
