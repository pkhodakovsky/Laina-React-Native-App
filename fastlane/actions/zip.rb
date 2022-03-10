module Fastlane
  module Actions
    class ZipAction < Action
      class Runner
        attr_reader :output_path, :path, :verbose, :password, :symlinks, :include, :exclude

        def initialize(params)
          @output_path = File.expand_path(params[:output_path] || params[:path])
          @path = params[:path]
          @verbose = params[:verbose]
          @password = params[:password]
          @symlinks = params[:symlinks]
          @include = params[:include] || []
          @exclude = params[:exclude] || []

          @output_path += ".zip" unless @output_path.end_with?(".zip")
        end

        def run
          UI.message("Compressing #{path}...")

          run_zip_command

          UI.success("Successfully generated zip file at path '#{output_path}'")
          output_path
        end


        def run_zip_command
          # The 'zip' command archives relative to the working directory, chdir to produce expected results relative to `path`
            Actions.sh("powershell", "compress-archive", "-LiteralPath", path, "-Update","-DestinationPath", output_path)
        end

        
      end

      def self.run(params)
        Runner.new(params).run
      end

      #####################################################
      # @!group Documentation
      #####################################################

      def self.description
        "Compress a file or folder to a zip"
      end

      def self.available_options
        [
          FastlaneCore::ConfigItem.new(key: :path,
                                       env_name: "FL_ZIP_PATH",
                                       description: "Path to the directory or file to be zipped",
                                       verify_block: proc do |value|
                                        path = File.expand_path(value)
                                         UI.user_error!("Couldn't find file/folder at path '#{path}'") unless File.exist?(path)
                                       end),
          FastlaneCore::ConfigItem.new(key: :output_path,
                                       env_name: "FL_ZIP_OUTPUT_NAME",
                                       description: "The name of the resulting zip file",
                                       optional: true),
          FastlaneCore::ConfigItem.new(key: :verbose,
                                       env_name: "FL_ZIP_VERBOSE",
                                       description: "Enable verbose output of zipped file",
                                       default_value: true,
                                       type: Boolean,
                                       optional: true),
          FastlaneCore::ConfigItem.new(key: :password,
                                       env_name: "FL_ZIP_PASSWORD",
                                       description: "Encrypt the contents of the zip archive using a password",
                                       optional: true),
          FastlaneCore::ConfigItem.new(key: :symlinks,
                                       env_name: "FL_ZIP_SYMLINKS",
                                       description: "Store symbolic links as such in the zip archive",
                                       optional: true,
                                       type: Boolean,
                                       default_value: false),
          FastlaneCore::ConfigItem.new(key: :include,
                                       env_name: "FL_ZIP_INCLUDE",
                                       description: "Array of paths or patterns to include",
                                       optional: true,
                                       type: Array,
                                       default_value: []),
          FastlaneCore::ConfigItem.new(key: :exclude,
                                       env_name: "FL_ZIP_EXCLUDE",
                                       description: "Array of paths or patterns to exclude",
                                       optional: true,
                                       type: Array,
                                       default_value: [])
        ]
      end

      def self.example_code
        [
          'zip',
          'zip(
            path: "MyApp.app",
            output_path: "Latest.app.zip"
          )',
          'zip(
            path: "MyApp.app",
            output_path: "Latest.app.zip",
            verbose: false
          )',
          'zip(
            path: "MyApp.app",
            output_path: "Latest.app.zip",
            verbose: false,
            symlinks: true
          )',
          'zip(
            path: "./",
            output_path: "Source Code.zip",
            exclude: [".git/*"]
          )',
          'zip(
            path: "./",
            output_path: "Swift Code.zip",
            include: ["**/*.swift"],
            exclude: ["Package.swift", "vendor/*", "Pods/*"]
          )'
        ]
      end

      def self.category
        :misc
      end

      def self.output
        []
      end

      def self.return_value
        "The path to the output zip file"
      end

      def self.return_type
        :string
      end

      def self.authors
        ["KrauseFx"]
      end

      def self.is_supported?(platform)
        true
      end
    end
  end
end