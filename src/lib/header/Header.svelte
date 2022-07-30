<script>


</script>



<div class="container">

    <div style="display: flex; flex-direction:column;">
        <a class="heading" href="/">
            Type with Friends
        </a>
        <span class="subheading">or anyone</span>
    </div>

    <div>
        <button class="btn" tabindex="-1"> <a style="text-decoration:none;color:#62cfe6;" href="/multiplayer"> Multiplayer</a></button>
    </div>
</div>


<style>
    .container{
        display: flex;
        justify-content: space-between;
        align-items: center;
        max-width: 60vw;
        margin: auto;
        padding-top: 20px;
    }

    .heading{
        
        color: black;
        padding: 15px;
        font-weight: 600;
        font-size: 35px;
        border-radius: 10px;
        text-decoration: none;
        cursor: pointer;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }

    .subheading{
        color: #62cfe6;
        font-size: 12px;
        position: relative;
        margin-left: 220px;
        margin-top: -20px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    
    }
    .btn{
        cursor: pointer;
        border: 2px #242b43 solid;
        color: #62cfe6;
        background-color: white;
        padding: 10px 20px;
        font-weight: 600;
        font-size: 24px;
        border-radius: 10px;
        opacity: 0.6;
    }

    .btn:hover{
        opacity: 1.5;
    }

    :global(body.dark-mode) .heading{
		color: white;
	}
    :global(body.dark-mode) .btn  {
		color: white;
        background-color: #212b43;
        border: #62cfe6 1px solid;
        opacity: 1;
	}

	:global(body.dark-mode) .container {
		background-color: #212b43;
	}

</style>