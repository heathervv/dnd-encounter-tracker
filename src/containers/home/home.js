import './home.css'

const Home = () => {
    return (
        <section>
            <h1>A custom DND combat creation/tracker tool.</h1>
            <p>Remaining work (in no particular order):</p>
            <ul>
                <li>List encounters</li>
                <li>Create new encounter</li>
                <li>Single encounter view</li>
                <li>Edit/delete existing encounter</li>
                <li>Hook encounter logic to localstorage</li>

                <li>Create new monster - UI, missing fields.</li>
                <li>Single monster view - UI</li>

                <li>Basic Combat tracker</li>
                <li>Update router to use hash instead so gh pages is happy</li>
            </ul>
            <p>NTH work to follow up:</p>
            <ul>
                <li>Add dynamic links to spells/conditions/other curious things</li>
                <li>Images (for players and monsters)</li>
            </ul>
        </section>
    )
}

export default Home
