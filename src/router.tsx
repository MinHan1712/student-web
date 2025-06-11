
import Classes from "./pages/Classes";
import ClassesDetails from "./pages/ClassesDetails";
import Course from "./pages/Course";
import GradeScoreManager from "./pages/GradeScoreManager";
import FacultiesDetails from "./pages/FaculitesDetails";
import FacultiesList from "./pages/Faculties";
import Students from "./pages/Students";
import Teachers from "./pages/Teachers";
import TeachesDetails from "./pages/TeachesDetails";
import ConductScoreManager from "./pages/ConductScoreManager";
import StatisticList from "./pages/StatisticList";
import StaticDetails from "./pages/StatisticsDetail";
import ClassManager from "./pages/ClassesManager";
import StudentGradePage from "./pages/GradesSummary";

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
			<TeachesDetails />
		),
		state: "teaches/details",
		path: "teaches/details",
	},
	{
		index: true,
		element: (
			<GradeScoreManager />
		),
		state: "grade-score-manager",
		path: "grade-score-manager",
	},
	{
		index: true,
		element: (
			<ConductScoreManager />
		),
		state: "course-score-manager",
		path: "course-score-manager",
	},
	{
		index: true,
		element: (
			<StatisticList />
		),
		state: "statistic",
		path: "statistic",
	},
	{
		index: true,
		element: (
			<StaticDetails />
		),
		state: "statistic/details",
		path: "statistic/details",
	},
	{
		index: true,
		element: (
			<ClassManager />
		),
		state: "classes/details",
		path: "classes/details",
	},
	{
		index: true,
		element: (
			<StudentGradePage />
		),
		state: "student/details",
		path: "student/details",
	},
];

export default routes;
